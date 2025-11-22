import { useState } from "react";
import moment from "moment";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, X, SendHorizontal } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface CommentsDialogProps {
  open: boolean;
  handleClose: () => void;
  user?: any;
  comments: any[];
}

const CommentsDialog = ({ comments, user, open, handleClose }: CommentsDialogProps) => {

  const [mappedComments, setMappedComments] = useState(comments);
  const [mainComment, setMainComment] = useState("");

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
      openReplies: item.id === id && (item.replies?.length > 0 || user) ? !item?.openReplies : item?.openReplies,
    })));
  };

  const handleSubmitMainComment = () => {
    if (!mainComment) return;
    const myComment = {
      id: `my_comment_${moment().utc()}`,
      photo: "",
      name: user?.name,
      date: moment().utc(),
      comment: mainComment,
      likes: 0,
      replies: [],
    };
    setMappedComments([ myComment, ...mappedComments ]);
    setMainComment("");
  };

  const handleSubmitMainCommentInput = (e: any) => {
    if (e.key === "Enter" && mainComment) handleSubmitMainComment();
  };

  const handleChangeSecondaryComment = (e: any, id: string) => {
    setMappedComments(mappedComments.map(item => ({
      ...item,
      commentInput: item.id === id ? e.target.value : "",
    })));
  };

  const handleSubmitSecondaryComment = (id: string) => {
    const commentInput = mappedComments.find(item => item.id === id)?.commentInput || "";
    if (!commentInput) return;
    const myComment = {
      id: `my_comment_${moment().utc()}`,
      photo: "",
      name: user?.name,
      date: moment().utc(),
      comment: commentInput,
      likes: 0,
      replies: [],
    };
    setMappedComments(mappedComments.map(item => ({
      ...item,
      commentInput: item.id === id ? "" : (item.commentInput || ""),
      replies: item.id === id ? [
        ...(item.replies || []),
        myComment,
      ] : item.replies,
    })));
  };

  const handleSubmitSecondaryCommentInput = (e: any, id: string) => {
    if (e.key === "Enter" && mappedComments.find(item => item.id == id)?.commentInput) handleSubmitSecondaryComment(id);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className="max-h-[100%] fixed left-[50%] bottom-0 z-50 grid w-full max-w-lg translate-x-[-50%] gap-4 border bg-background px-6 pt-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-bottom rounded-tl-lg rounded-tr-lg"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <h1 className="text-center font-medium">Komentar</h1>
          {mappedComments?.length <= 0 ? (
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
                      <div className="flex items-center">
                        <Tooltip label="Suka">
                          <Button
                            variant="ghost"
                            className="rounded-[50%] h-6 w-6 p-4"
                            onClick={() => handleLike(comment.id)}
                            disabled={!user}
                          >
                            <Heart className={comment?.liked ? "text-primary" : ""} style={{ width: "1.2rem", height: "1.2rem" }}/>
                          </Button>
                        </Tooltip>
                        <span className="text-xs text-muted-foreground">{comment.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <Tooltip label="Komentar">
                          <Button
                            variant="ghost"
                            className="rounded-[50%] h-6 w-6 p-4"
                            onClick={() => handleReply(comment.id)}
                            disabled={!user && comment?.replies?.length <= 0}
                          >
                            <MessageCircle className={comment?.openReplies ? "text-primary" : ""} style={{ width: "1.2rem", height: "1.2rem" }}/>
                          </Button>
                        </Tooltip>
                        <span className="text-xs text-muted-foreground">{comment.replies?.length || 0}</span>
                      </div>
                    </div>

                    {/* replies for the comment */}
                    {comment?.openReplies && (
                      <div className="mt-2">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex gap-2">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={reply.photo} />
                              <AvatarFallback>{getInitials(reply.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <p className="font-medium flex-1">{reply.name}</p>
                                <span className="ml-2 text-xs text-muted-foreground text-right max-w-fit">{moment(reply.date).fromNow()}</span>
                              </div>
                              <p>{reply.comment}</p>
                              <div className="flex gap-1">
                                <div className="flex items-center">
                                  <Tooltip label="Suka">
                                    <Button
                                      variant="ghost"
                                      className="rounded-[50%] h-6 w-6 p-4"
                                      onClick={() => handleLikeReply(comment.id, reply.id)}
                                      disabled={!user}
                                    >
                                      <Heart className={reply?.liked ? "text-primary" : ""} style={{ width: "1.2rem", height: "1.2rem" }}/>
                                    </Button>
                                  </Tooltip>
                                  <span className="text-xs text-muted-foreground">{reply.likes}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {user && (
                          <div className="pb-6 pt-2 flex gap-2">
                            <Input
                              placeholder="Tulis komentar disini..."
                              value={comment.commentInput}
                              onChange={(e) => handleChangeSecondaryComment(e, comment.id)}
                              onKeyDown={(e) => handleSubmitSecondaryCommentInput(e, comment.id)}
                            />
                            <Button
                              variant="ghost"
                              className="rounded-[50%] h-10 w-10 p-4"
                              onClick={() => handleSubmitSecondaryComment(comment.id)}
                            >
                              <SendHorizontal className="text-primary" style={{ width: "1.5rem", height: "1.5rem" }}/>
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
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
                <SendHorizontal className="text-primary" style={{ width: "1.5rem", height: "1.5rem" }}/>
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