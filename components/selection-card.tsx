import { Card } from "@/components/ui/card"

type Props = {
  title: string
  selected: boolean
  onClick: () => void
}

export default function SelectionCard({ title, selected, onClick }: Props) {
  return (
    <Card
      onClick={onClick}
      className={`p-4 cursor-pointer transition ${
        selected ? "border-2 border-black" : ""
      }`}
    >
      <p className="text-lg font-medium">{title}</p>
    </Card>
  )
}
