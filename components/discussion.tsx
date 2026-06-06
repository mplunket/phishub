"use client";
import * as React from "react";
import type { CommentWithAuthor } from "@/lib/api";
import { createComment } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function AuthorLine({ comment }: { comment: CommentWithAuthor }) {
  const name = comment.author?.username ?? "Unknown";
  return (
    <div className="flex items-center gap-2 mb-1">
      <Avatar className="h-6 w-6">
        {comment.author?.avatar_url && (
          <AvatarImage src={comment.author.avatar_url} alt={name} />
        )}
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{name}</span>
      <span className="text-xs text-muted-foreground">
        {new Date(comment.created_at).toLocaleString()}
      </span>
    </div>
  );
}

function CommentForm({
  songId,
  slug,
  parentId,
  onDone,
  placeholder,
}: {
  songId: string;
  slug: string;
  parentId?: string;
  onDone?: () => void;
  placeholder?: string;
}) {
  const ref = React.useRef<HTMLFormElement>(null);

  async function action(formData: FormData) {
    await createComment(formData);
    ref.current?.reset();
    onDone?.();
  }

  return (
    <form ref={ref} action={action} className="space-y-2">
      <input type="hidden" name="songId" value={songId} />
      <input type="hidden" name="slug" value={slug} />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}
      <Textarea
        name="content"
        required
        rows={parentId ? 2 : 3}
        placeholder={placeholder ?? "Add a comment..."}
      />
      <div className="flex justify-end gap-2">
        {parentId && onDone && (
          <Button type="button" variant="ghost" size="sm" onClick={onDone}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm">
          {parentId ? "Reply" : "Post comment"}
        </Button>
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  replies,
  songId,
  slug,
  canComment,
}: {
  comment: CommentWithAuthor;
  replies: CommentWithAuthor[];
  songId: string;
  slug: string;
  canComment: boolean;
}) {
  const [replying, setReplying] = React.useState(false);

  return (
    <div className="p-4 rounded-lg border">
      <AuthorLine comment={comment} />
      <p className="mb-2 whitespace-pre-line">{comment.content}</p>

      {canComment && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setReplying((v) => !v)}
        >
          Reply
        </Button>
      )}

      {replying && (
        <div className="mt-2">
          <CommentForm
            songId={songId}
            slug={slug}
            parentId={comment.id}
            onDone={() => setReplying(false)}
            placeholder="Write a reply..."
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="mt-3 ml-6 space-y-3 border-l pl-4">
          {replies.map((reply) => (
            <div key={reply.id}>
              <AuthorLine comment={reply} />
              <p className="whitespace-pre-line">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Discussion({
  comments,
  songId,
  slug,
  canComment,
}: {
  comments: CommentWithAuthor[];
  songId: string;
  slug: string;
  canComment: boolean;
}) {
  const topLevel = comments.filter((c) => !c.parent_id);
  const repliesByParent = React.useMemo(() => {
    const map: Record<string, CommentWithAuthor[]> = {};
    for (const c of comments) {
      if (c.parent_id) (map[c.parent_id] ??= []).push(c);
    }
    return map;
  }, [comments]);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Discussion</h2>

      {canComment ? (
        <div className="mb-6">
          <CommentForm songId={songId} slug={slug} />
        </div>
      ) : (
        <p className="text-muted-foreground mb-6">
          Sign in to join the discussion.
        </p>
      )}

      {topLevel.length > 0 ? (
        <div className="space-y-4">
          {topLevel.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={repliesByParent[comment.id] ?? []}
              songId={songId}
              slug={slug}
              canComment={canComment}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No comments yet. Start the discussion!
        </p>
      )}
    </section>
  );
}
