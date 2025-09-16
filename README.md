# Funcionalidade

### Table
```typescript
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
```

### TableHead
```typescript
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
```

## Uso
### TableHead
```typescript
<TableHead minWidth={300}>Column</TableHead>

<TableHead key={header.id} minWidth={columns[header.column.getIndex()].minWidth}>
  {header.isPlaceholder
    ? null
    : flexRender(
      header.column.columnDef.header,
      header.getContext()
    )}
</TableHead>
```

### ColumnDef
```typescript

export type ColumnMinWidth<T> = ColumnDef<T> & { minWidth?: number }

export const columns: ColumnMinWidth<Payment>[] = [
  {
    minWidth:300,
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("id")}</div>
    ),
  }
]

```


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
