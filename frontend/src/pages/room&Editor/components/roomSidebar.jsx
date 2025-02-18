import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RoomSidebar({ users }) {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen p-4">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">Room Members</h2>
      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="space-y-4">
          {users?.map((user) => (
            <div key={user.id} className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-slate-200">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
