export function IconStart({ alt, size = 20 }: { alt?: string; size?: number }) {
  return (
    <svg
      aria-label={alt}
      fill="none"
      height={size}
      role="img"
      viewBox="0 0 20 20"
      width={size}
    >
      <path
        d="M16.5 15.833V4.167a.667.667 0 0 0-.667-.667H12.5a1 1 0 1 1 0-2h3.333A2.667 2.667 0 0 1 18.5 4.167v11.666a2.668 2.668 0 0 1-2.667 2.667H12.5a1 1 0 1 1 0-2h3.333a.667.667 0 0 0 .667-.667ZM7.626 5.126a1 1 0 0 1 1.339-.068l.075.068 4.167 4.167a1 1 0 0 1 0 1.414L9.04 14.874a1 1 0 0 1-1.414-1.414l2.46-2.46H2.5a1 1 0 1 1 0-2h7.586l-2.46-2.46-.068-.075a1 1 0 0 1 .068-1.339Z"
        fill="currentColor"
      />
    </svg>
  )
}
