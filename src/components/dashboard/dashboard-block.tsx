import { Card } from "@/components/ui/card"

type DashboardBlockProps = {
  className?: string
}

export function DashboardBlock({
  className,
}: DashboardBlockProps) {
  return (
    <Card className={`rounded-3xl ${className}`} />
  )
}