import OrderCard from '../blocks/OrderCard.client';
import {Button, Text} from '../elements';

export default function OrderHistory({orders}) {
  return (
    <div className="mt-6">
      {!orders.length ? <EmptyOrders /> : <Orders orders={orders} />}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div>
      <Text width="narrow" as="p">
        You haven't made any orders yet.
      </Text>
      <Button width="auto" variant="secondary" to={'/'}>
        Start shopping
      </Button>
    </div>
  );
}

function Orders({orders}) {
  return (
    <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
      <h2 className="font-bold text-lead">Order History</h2>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
      >
        {orders.map((order) => (
          <OrderCard order={order} key={order.id} />
        ))}
      </ul>
    </div>
  );
}
