import { Link } from 'react-router-dom'
import { Page } from '@/components/shell'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <Page title="Not found">
      <div className="flex flex-col items-center py-20 text-center">
        <h2 className="text-[24px] font-semibold">This page doesn't exist</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">The plan or doctor may have been removed when the demo was reset.</p>
        <Button asChild className="mt-6"><Link to="/">Go to Today</Link></Button>
      </div>
    </Page>
  )
}
