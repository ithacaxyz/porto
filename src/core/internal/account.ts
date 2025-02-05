import * as Address from 'ox/Address';
import type * as Hex from 'ox/Hex';
import * as Secp256k1 from 'ox/Secp256k1';
import * as Signature from 'ox/Signature';

import * as Key from './key.js';
import type { Compute, RequiredBy } from './types.js';

/** A delegated account. */
export type Account = {
  address: Address.Address;
  keys?: readonly Key.Key[];
  sign?: (parameters: { payload: Hex.Hex }) => Promise<Hex.Hex>;
  type: 'delegated';
};

/**
 * Creates a delegated account.
 *
 * @param parameters - Account parameters.
 * @returns An initialized delegated account.
 */
export function from<Params extends from.Parameters>(
  parameters: Params,
): Compute<from.ReturnType<Params>> {
  const account = typeof parameters === 'string'
    ? { address: parameters }
    : parameters;
  return { ...account, type: 'delegated' } as Compute<from.ReturnType<Params>>;
}

export namespace from {
  export type AccountParameter = Omit<Account, 'type'>;

  export type Parameters =
    | Address.Address
    | AccountParameter;

  export type ReturnType<Params extends Parameters> = Readonly<
    (Params extends AccountParameter ? Params : { address: Params }) & {
      type: 'delegated';
    }
  >;
}

/**
 * Creates a delegated account from a private key.
 *
 * @param privateKey - Private key.
 * @param options - Options.
 * @returns An initialized delegated account.
 */
export function fromPrivateKey<Opts extends fromPrivateKey.Options = {}>(
  privateKey: Hex.Hex,
  options: Opts = {} as Opts,
): Compute<fromPrivateKey.ReturnType<Opts>> {
  const { keys } = options;
  const address = Address.fromPublicKey(Secp256k1.getPublicKey({ privateKey }));
  return from({
    address,
    keys,
    async sign({ payload }) {
      return Signature.toHex(
        Secp256k1.sign({
          privateKey,
          payload,
        }),
      );
    },
  }) as Compute<fromPrivateKey.ReturnType<Opts>>;
}

export namespace fromPrivateKey {
  export type Options = {
    /**
     * Keys to initialize.
     */
    keys?: readonly Key.Key[];
  };

  export type ReturnType<Opts extends Options> = Readonly<
    RequiredBy<Omit<Account, 'keys'>, 'sign'> &
    (Opts['keys'] extends readonly Key.Key[]
      ? { keys: Opts['keys'] }
      : { keys?: Account['keys'] })
  >;
}

/**
 * Extracts a signing key from a delegated account and signs payload(s).
 *
 * @param account - Account.
 * @param parameters - Parameters.
 * @returns Signatures.
 */
export async function sign<
  Acc extends Account,
  Payloads extends sign.Payloads,
>(
  account: Acc,
  parameters: sign.Parameters<Acc, Payloads>,
): Promise<Compute<Payloads>> {
  const { payloads, key } = parameters;
  const [payload, authorizationPayload] = payloads;

  // Determine the signing function
  const signFunction = key
    ? (typeof key === 'object'
      ? (params: { payload: Hex.Hex }) => Key.sign(key, { ...params, address: account.address })
      : account.keys?.[key]?.canSign
        ? (params: { payload: Hex.Hex }) => Key.sign(account.keys[key], { ...params, address: account.address })
        : undefined)
    : authorizationPayload
      ? account.sign
      : account.keys?.find(k => k.canSign)
        ? (params: { payload: Hex.Hex }) => Key.sign(account.keys.find(k => k.canSign)!, { ...params, address: account.address })
        : account.sign;

  if (!signFunction) {
    throw new Error('Unable to find a key to sign with.');
  }

  const signatures = await Promise.all([
    signFunction({ payload }),
    authorizationPayload && account.sign
      ? account.sign({ payload: authorizationPayload })
      : undefined,
  ]);

  return signatures as Compute<Payloads>;
}

export namespace sign {
  export type Parameters<
    Acc extends Account,
    Payloads extends PayloadsType,
  > = {
    /**
     * Key to sign the payloads. If not specified, a key will be extracted from the account.
     */
    key?: number | Key.Key;
    /**
     * Payloads to sign.
     */
    payloads: Payloads &
    (Acc extends { sign: NonNullable<Account['sign']> }
      ? PayloadsType
      : readonly [execute: Hex.Hex]);
  };

  export type PayloadsType =
    | readonly [execute: Hex.Hex]
    | readonly [execute: Hex.Hex, authorization: Hex.Hex];
}
