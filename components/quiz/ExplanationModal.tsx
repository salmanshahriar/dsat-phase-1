import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"

interface ExplanationModalProps {
  explanation: string
}

export function ExplanationModal({ explanation }: ExplanationModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <Lightbulb className="w-3 h-3" />
          <span className="text-xs">Explain</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-800">Explanation</DialogTitle>
        </DialogHeader>
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <div className="prose prose-sm prose-gray max-w-none">
            <div dangerouslySetInnerHTML={{ __html: explanation }} />
          </div>
        </div>
      </DialogContent>

  
    </Dialog>
  )
}

