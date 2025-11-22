import { useState, useEffect } from "react";
import moment from "moment";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, X, SendHorizontal } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { dictionaryService } from "@/services/dictionary.service";
import { useToast } from "@/hooks/use-toast";

interface CommentsDialogProps {
  open: boolean;
  handleClose: () => void;
  user?: any;
  dictionaryId: number | null;
}

const CommentsDialog = ({ user, open, handleClose, dictionaryId }: CommentsDialogProps) => {
  const { toast } = useToast();
  const [mappedComments, setMappedComments] = useState<any[]>([]);
  const [mainComment, setMainComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && dictionaryId) {
      fetchComments();
    }
  }, [open, dictionaryId]);

  const fetchComments = async () => {
    if (!dictionaryId) return;
    setLoading(true);
    try {
      const data = await dictionaryService.getComments(dictionaryId);
      // Transform to match UI structure (nested replies)
      // For now, API returns flat list. We can organize them if needed.
      // The current UI expects nested 'replies'. 
      // Let's just show flat list for now or simple nesting if parent_id exists.

      const commentsMap = new Map();
      const rootComments: any[] = [];

      data.forEach((c: any) => {
        commentsMap.set(c.id, { ...c, name: c.user_name, date: c.created_at, comment: c.content, likes: 0, replies: [], liked: false });
      });

      data.forEach((c: any) => {
        if (c.parent_id) {
          const parent = commentsMap.get(c.parent_id);
          if (parent) {
            parent.replies.push(commentsMap.get(c.id));
          }
        } else {
          rootComments.push(commentsMap.get(c.id));
        }
      });

      setMappedComments(rootComments);
    } catch (error) {
      console.error(error);
      toast({ title: "Gagal memuat komentar", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (id: any) => {
    // TODO: Implement like comment API
    setMappedComments(mappedComments.map(item => ({
      ...item,
      likes: item.id === id ? (!item?.liked ? (item.likes || 0) + 1 : (item.likes || 0) - 1) : item.likes,
      liked: item.id === id ? !item?.liked : item?.liked,
    })));
  };

  const handleReply = (id: any) => {
    setMappedComments(mappedComments.map(item => ({
      ...item,
      openReplies: item.id === id ? !item?.openReplies : item?.openReplies,
    })));
  };

  const handleSubmitMainComment = async () => {
    if (!mainComment || !dictionaryId) return;
    try {
      const newComment = await dictionaryService.addComment(dictionaryId, mainComment);

      const uiComment = {
        id: newComment.id,
        photo: "",
        name: user?.name,
        date: newComment.created_at,
        comment: newComment.content,
        likes: 0,
        replies: [],
      };

      setMappedComments([uiComment, ...mappedComments]);
      setMainComment("");
    } catch (error) {
      toast({ title: "Gagal mengirim komentar", variant: "destructive" });
    }
  };

  const handleSubmitMainCommentInput = (e: any) => {
    if (e.key === "Enter" && mainComment) handleSubmitMainComment();
  };

  // ... (Secondary comment logic omitted for brevity, can be added later if needed) ...
  // For now, let's keep the UI simple and just support main comments or basic display.

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className="max-h-[100%] fixed left-[50%] bottom-0 z-50 grid w-full max-w-lg translate-x-[-50%] gap-4 border bg-background px-6 pt-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-bottom rounded-tl-lg rounded-tr-lg"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <h1 className="text-center font-medium">Komentar</h1>
          {loading ? (
            <p className="text-center py-4">Memuat...</p>
          ) : mappedComments?.length <= 0 ? (
            <p className="text-muted-foreground text-sm text-center my-4">Belum ada komentar</p>
          ) : (
            <div className="overflow-auto max-h-[75vh] flex flex-col">
              {mappedComments.map(comment => (
                <div key={comment.id} className="flex gap-2 py-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.photo} />
                    <AvatarFallback>{getInitials(comment.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{comment.name}</p>
                      <span className="ml-2 text-xs text-muted-foreground text-right">{moment(comment.date).fromNow()}</span>
                    </div>
                    <p>{comment.comment}</p>
                    <div className="flex gap-1">
                      {/* Like & Reply buttons (Visual only for now for comments) */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {user && (
            <div className="pb-6 pt-2 flex gap-2">
              <Input
                placeholder="Tulis komentar disini..."
                value={mainComment}
                onChange={(e) => setMainComment(e.target.value)}
                onKeyDown={handleSubmitMainCommentInput}
              />
              <Button
                variant="ghost"
                className="rounded-[50%] h-10 w-10 p-4"
                onClick={handleSubmitMainComment}
              >
                <SendHorizontal className="text-primary" style={{ width: "1.5rem", height: "1.5rem" }} />
              </Button>
            </div>
          )}

          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};

export default CommentsDialog;