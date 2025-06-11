export function ChangelogDate(props: ChangelogDate.Props) {
  const { date } = props

  return (
    <div className="-mt-6 flex items-center gap-2">
      <div className="font-[400] text-secondary text-sm">
        {new Date(date).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </div>
    </div>
  )
}

export declare namespace ChangelogDate {
  export interface Props {
    date: string
  }
}
