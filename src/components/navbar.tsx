"use client";

import { useAuth } from "@/lib/auth-context";
import { Bookmark, LogOut, Plus, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface NavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

export function Navbar({ search, onSearchChange, onAddClick }: NavbarProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        <div className="flex items-center gap-2 font-bold text-lg shrink-0">
          <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
          ReadStash
        </div>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search saved articles..."
            className="pl-9 h-9"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button size="sm" onClick={onAddClick}>
            <Plus className="w-4 h-4 mr-1" />
            Add URL
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full cursor-pointer outline-none">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.photoURL ?? undefined} />
                <AvatarFallback>
                  {user?.displayName?.[0] ?? "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
                {user?.email}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
