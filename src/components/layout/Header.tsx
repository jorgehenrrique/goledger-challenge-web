import { Input } from '../ui/input';
import { Search } from 'lucide-react';

export function Header() {
  return (
    <header className='h-16 border-b border-zinc-800 px-6 flex items-center'>
      <div className='relative flex-1 max-w-md'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400' />
        <Input placeholder='Buscar...' className='pl-10' />
      </div>
    </header>
  );
}
