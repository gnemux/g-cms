import { siteConfig } from '@/lib/config'
import Link from 'next/link'

export function Header() {
    return (
        <header className="bg-slate-900 border-b border-slate-800">
            <div className="container mx-auto px-4 py-4">
                <Link href="/" className="inline-block">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#B65051] to-orange-400">
                        {siteConfig.title}
                    </h1>
                </Link>
                {/* 其他代码... */}
            </div>
        </header>
    )
} 