import { ReactNode } from 'react'
import styles from './SynapseGridLayout.module.scss'

export type SynapseGridLayoutProps = {
  /** Content shown above the grid content, such as the page title */
  header?: ReactNode
  /** Class name for the container around `children`, which excludes `header` and `sidebar` */
  contentClassName?: string
  /** A sidebar docked to the right of the header and grid content, such as the GridAgentSidebar */
  sidebar?: ReactNode
  children: ReactNode
}

/**
 * Lays out the grid page: an optional header above the grid content, with an optional sidebar
 * docked to the right of both. The sidebar takes its own width, and the header and content get the rest.
 */
export function SynapseGridLayout({
  header,
  contentClassName,
  sidebar,
  children,
}: SynapseGridLayoutProps) {
  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        {header}
        <div className={contentClassName}>{children}</div>
      </div>
      {sidebar}
    </div>
  )
}

export default SynapseGridLayout
