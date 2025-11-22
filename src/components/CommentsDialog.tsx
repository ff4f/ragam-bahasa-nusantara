import { useState } from "react";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, X } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface CommentsDialogProps {
  open: boolean;
  handleClose: () => void;
  user?: any;
  comments: any[];
}

const CommentsDialog = ({ comments, open, handleClose }: CommentsDialogProps) => {

  const [mappedComments, setMappedComments] = useState(comments);

  const handleLike = (id: any) => {
    setMappedComments(mappedComments.map(item => ({
      ...item,
      likes: item.id === id ? (!item?.liked ? (item.likes || 0) + 1 : (item.likes || 0) - 1) : item.likes,
      liked: item.id === id ? !item?.liked : item?.liked,
    })));
  };


  const handleLikeReply = (mainId: any, secondaryId: any) => {
    setMappedComments(mappedComments.map(item => ({
      ...item,
      replies: item.id === mainId ? item.replies.map(reply => ({
        ...reply,
        likes: reply.id === secondaryId ? (!reply?.liked ? (reply.likes || 0) + 1 : (reply.likes || 0) - 1) : reply.likes,
        liked: reply.id === secondaryId ? !reply?.liked : reply?.liked,
      })) : item.replies,
    })));
  };

  const handleReply = (id: any) => {
    setMappedComments(mappedComments.map(item => ({
      ...item,
      openReplies: item.id === id && item.replies?.length > 0 ? !item?.openReplies : item?.openReplies,
    })));
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className="max-h-[100%] fixed left-[50%] bottom-0 z-50 grid w-full max-w-lg translate-x-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-bottom sm:rounded-tl-lg sm:rounded-tr-lg"
        >
          <h1 className="text-center font-medium">Komentar</h1>
          {mappedComments?.length <= 0 ? (
            <p className="text-muted-foreground text-sm text-center my-4">Belum ada komentar</p>
          ) : (
            <div className="overflow-auto max-h-[80vh] flex flex-col gap-2">
              {mappedComments.map(comment => (
                <div className="flex gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.photo} />
                    <AvatarFallback>{getInitials(comment.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{comment.name}</p>
                    <p>{comment.comment}</p>
                    <div className="flex gap-1">
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          className="rounded-[50%] h-6 w-6 p-4"
                          onClick={() => handleLike(comment.id)}
                        >
                          <Heart className={comment?.liked ? "text-primary" : ""} style={{ width: "1.2rem", height: "1.2rem" }}/>
                        </Button>
                        <span className="text-xs text-muted-foreground">{comment.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          className="rounded-[50%] h-6 w-6 p-4"
                          onClick={() => handleReply(comment.id)}
                        >
                          <MessageCircle className={comment?.openReplies ? "text-primary" : ""} style={{ width: "1.2rem", height: "1.2rem" }}/>
                        </Button>
                        <span className="text-xs text-muted-foreground">{comment.replies?.length || 0}</span>
                      </div>
                    </div>

                    {/* replies for the comment */}
                    {comment?.openReplies && (
                      <div className="mt-2">
                        {comment.replies.map(reply => (
                          <div className="flex gap-2">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={reply.photo} />
                              <AvatarFallback>{getInitials(reply.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{reply.name}</p>
                              <p>{reply.comment}</p>
                              <div className="flex gap-1">
                                <div className="flex items-center">
                                  <Button
                                    variant="ghost"
                                    className="rounded-[50%] h-6 w-6 p-4"
                                    onClick={() => handleLikeReply(comment.id, reply.id)}
                                  >
                                    <Heart className={reply?.liked ? "text-primary" : ""} style={{ width: "1.2rem", height: "1.2rem" }}/>
                                  </Button>
                                  <span className="text-xs text-muted-foreground">{reply.likes}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
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