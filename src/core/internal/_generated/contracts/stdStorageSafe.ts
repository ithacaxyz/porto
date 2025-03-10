export const abi = [
  {
    "type": "event",
    "name": "SlotFound",
    "inputs": [
      {
        "name": "who",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "fsig",
        "type": "bytes4",
        "indexed": false,
        "internalType": "bytes4"
      },
      {
        "name": "keysHash",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "slot",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "WARNING_UninitedSlot",
    "inputs": [
      {
        "name": "who",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "slot",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
] as const;

export const code = "0x60556032600b8282823980515f1a607314602657634e487b7160e01b5f525f60045260245ffd5b305f52607381538281f3fe730000000000000000000000000000000000000000301460806040525f80fdfea264697066735822122083726e780fcf3aeb88367f7a9497e3196b437c27c3e1a37b629990a728980f9364736f6c634300081a0033" as const;

