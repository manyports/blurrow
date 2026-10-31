import React from "react";
import { Avatar } from "./Avatar";
import { Button } from "./Button";

interface AuthorCardProps {
  name: string;
  bio?: string;
  avatarSrc?: string;
  onFollow?: () => void;
  className?: string;
}

export function AuthorCard({
  name,
  bio,
  avatarSrc,
  onFollow,
  className = "",
}: AuthorCardProps) {
  return (
    <div
      className={[
        "rim relative rounded-[22px] p-1.5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ background: "var(--panel-bezel)", boxShadow: "var(--card-shadow)" }}
    >
      <div className="relative bg-panel-face rounded-[17px] overflow-hidden" style={{ boxShadow: "var(--panel-face-shadow)" }}>
        {/* Cover: a sunken well, so the avatar visibly sits on top of it */}
        <div
          aria-hidden
          className="h-20 relative overflow-hidden"
          style={{
            background:
              "var(--cover)",
            boxShadow: "var(--cover-shadow)",
          }}
        />
        <div className="px-6 pb-6">
          <div className="-mt-8 mb-4">
            <Avatar
              src={avatarSrc}
              name={name}
              size="lg"
              className="ring-[3.5px] ring-panel-face shadow-[var(--avatar-lift)]"
            />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-ink leading-snug truncate tracking-[-0.01em]">{name}</p>
              {bio && (
                <p className="text-[13px] text-ink-muted leading-relaxed mt-1 line-clamp-2">{bio}</p>
              )}
            </div>
            {onFollow && (
              <Button variant="primary" size="sm" onClick={onFollow} className="shrink-0">
                follow
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
