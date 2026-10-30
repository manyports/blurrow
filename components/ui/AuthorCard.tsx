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
      style={{ background: "var(--panel-bezel)", boxShadow: "var(--card-light-shadow)" }}
    >
      <div className="relative bg-white rounded-[17px] overflow-hidden" style={{ boxShadow: "var(--panel-face-shadow)" }}>
        {/* Cover: a sunken well, so the avatar visibly sits on top of it */}
        <div
          aria-hidden
          className="h-20 relative overflow-hidden"
          style={{
            background:
              "radial-gradient(130% 90% at 25% 0%, rgba(255,255,255,0.7), transparent 60%), linear-gradient(180deg, #ececeb 0%, #f4f4f3 100%)",
            boxShadow: "inset 0 1px 3px rgba(17,17,17,0.06), inset 0 -2px 3px -2px rgba(17,17,17,0.05)",
          }}
        />
        <div className="px-6 pb-6">
          <div className="-mt-8 mb-4">
            <Avatar
              src={avatarSrc}
              name={name}
              size="lg"
              className="ring-[3.5px] ring-white shadow-[0_3px_12px_-2px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)]"
            />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-neutral-900 leading-snug truncate tracking-[-0.01em]">{name}</p>
              {bio && (
                <p className="text-[13px] text-neutral-500 leading-relaxed mt-1 line-clamp-2">{bio}</p>
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
