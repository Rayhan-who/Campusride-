import { getMyBusRequests } from "@/lib/data/busRequests";
import { BusRequestForm } from "@/components/requests/BusRequestForm";
import { BusRequestListItem } from "@/components/requests/BusRequestListItem";
import { Card } from "@/components/shared/Card";

export default async function BusRequestsPage() {
  const requests = await getMyBusRequests();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text">Bus Requests</h1>
        <p className="text-sm text-text-muted">
          Request buses for a university event or any other purpose.
        </p>
      </div>

      <Card className="p-5">
        <BusRequestForm />
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-text">My Requests</h2>
        {requests.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-muted">
            You haven&apos;t submitted any bus requests yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {requests.map((request) => (
              <BusRequestListItem key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
