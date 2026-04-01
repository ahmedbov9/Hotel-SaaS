import type { Membership } from "@/types/membership";

type MembershipListProps = {
  items: Membership[];
  canManage: boolean;
  onToggleActive: (membership: Membership) => Promise<void>;
};

export function MembershipList({
  items,
  canManage,
  onToggleActive,
}: MembershipListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        No staff members found for this hotel.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item._id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.userId.fullName}
                </h3>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {item.role}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    item.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mt-2 space-y-1 text-sm text-slate-600">
                <p>Email: {item.userId.email}</p>
                <p>Phone: {item.userId.phone || "--"}</p>
                <p>
                  Invited By:{" "}
                  {item.invitedBy
                    ? `${item.invitedBy.fullName} (${item.invitedBy.email})`
                    : "--"}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {item.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>

            <div>
{canManage ? (
              <button
                onClick={() => onToggleActive(item)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
              >
                {item.isActive ? "Deactivate" : "Activate"}
              </button>) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}