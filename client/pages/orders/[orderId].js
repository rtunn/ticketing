import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = +new Date(order.expiresAt) - +new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(() => findTimeLeft(order), 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return (
      <div>
        <h1>{order.ticket.title}</h1>
        <h4>Order Expired</h4>
      </div>
    );
  }

  return (
    <div>
      <h1>Purchase {order.ticket.title}</h1>
      <h4>You have {timeLeft} seconds left to checkout</h4>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51KnB4UL4wHEjjtVLV53RHSuQzlVGARercWdoueSU6txQL19vkQQ3FTlLoGDXLncxS2xjizkx0N5QTKbSQ31QcFB500lKAAWkIn"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
