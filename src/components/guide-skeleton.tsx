import { Skeleton } from "@/components/ui/skeleton"

export function GuideSkeleton() {
  return (
    <div className="space-y-4">
       <Skeleton className="h-8 w-1/2" />
      <div className="space-y-4 pt-4">
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-3 pl-8">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
          <div className="space-y-3 pl-8">
              <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    </div>
  )
}
