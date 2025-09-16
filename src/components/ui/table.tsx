"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const isMobile = useIsMobile()

  React.useLayoutEffect(() => {
    const handleResize = () => {
      if (containerRef?.current) {
        const container = containerRef?.current
        const width = container.clientWidth + 1
        const ths: HTMLTableCellElement[] = Array.from(container.querySelectorAll('th'))
        ths.forEach(el => {
          let min = el.dataset.minWidth
          if(min)
            min+='px'
          el.style.scrollSnapAlign=''
          el.style.minWidth = min??''
          el.style.maxWidth = ''
        })

        if(!isMobile)
          return;

        const widths = ths.map(el => el.clientWidth)

        let sum = 0
        let start = 0
        const columns: { start: number; end: number }[] = []
        for (let i = 0; i < widths.length; i++) {
          sum += widths[i]

          const isLast = i === widths.length - 1
          
          if (sum <= width) {

            if (isLast)
              columns.push({ start, end: i })
            else
              continue

          } else {

            const isJustOne = i === start
            let end = isJustOne ? i : i - 1

            columns.push({ start, end })
            start = end + 1

            sum = widths[i]

            if ((!isJustOne) && (isLast||widths[i] > width)){
              columns.push({ start: i, end: i })
              start++
              sum=0
            }

            continue
          }
        }
        for(const column of columns)
        {
          const fitted = ths.slice(column.start,column.end+1)
          const remaining = width - fitted.reduce((acc, n) => acc + n.clientWidth, 0)       
          const space = remaining > 0 ? remaining / fitted.length : 0
          fitted.forEach(th=>{
            const origWidth = th.clientWidth
            let newWidth = origWidth + space
            if(newWidth>width)
              newWidth=width
            th.style.minWidth=`${newWidth}px`
            th.style.maxWidth=`${newWidth}px`
          })
          fitted[0].style.scrollSnapAlign="start"
        }
      }

    }
    handleResize()
    const observer = new ResizeObserver(handleResize);
    if(containerRef.current)
      observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef.current, isMobile])

  return (
    <div
      ref={containerRef}
      data-slot="table-container"
      className="relative w-full overflow-x-auto scroll-smooth snap-x snap-mandatory"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className,minWidth, ...props }: React.ComponentProps<"th"> & { minWidth?:number }) {
  return (
    <th
      data-min-width={minWidth}
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
