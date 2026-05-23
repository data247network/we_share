const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID!;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY!;
const ONESIGNAL_API = "https://onesignal.com/api/v1";

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  url?: string;
}

async function sendNotification(
  playerIds: string[],
  payload: NotificationPayload
) {
  const res = await fetch(`${ONESIGNAL_API}/notifications`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      app_id: ONESIGNAL_APP_ID,
      include_player_ids: playerIds,
      headings: { en: payload.title },
      contents: { en: payload.body },
      data: payload.data,
      url: payload.url,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("OneSignal error:", err);
  }
  return res.json();
}

export const notify = {
  poolFilled: (playerIds: string[], poolRef: string) =>
    sendNotification(playerIds, {
      title: "Pool filled! 🎉",
      body: `Pool ${poolRef} is full. Your order is being prepared.`,
      data: { type: "pool_filled", pool_ref: poolRef },
    }),

  orderShipped: (playerIds: string[], poolRef: string, eta: string) =>
    sendNotification(playerIds, {
      title: "Your share is on the way 🛵",
      body: `Rider picked up ${poolRef}. ETA: ${eta}`,
      data: { type: "order_shipped", pool_ref: poolRef },
    }),

  orderDelivered: (playerIds: string[], poolRef: string) =>
    sendNotification(playerIds, {
      title: "Delivered! ✓",
      body: `Your share from ${poolRef} has been delivered.`,
      data: { type: "order_delivered", pool_ref: poolRef },
    }),

  inviteReceived: (
    playerIds: string[],
    inviterName: string,
    itemName: string,
    inviteToken: string
  ) =>
    sendNotification(playerIds, {
      title: `${inviterName} invited you to share`,
      body: `Join the pool for ${itemName} — save up to 35%`,
      data: { type: "pool_invite", token: inviteToken },
      url: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${inviteToken}`,
    }),

  poolAlmostFull: (playerIds: string[], poolRef: string, remaining: number) =>
    sendNotification(playerIds, {
      title: `Only ${remaining} spot${remaining > 1 ? "s" : ""} left!`,
      body: `Pool ${poolRef} is almost full. Invite someone to fill it.`,
      data: { type: "pool_almost_full", pool_ref: poolRef },
    }),

  paymentHeld: (playerIds: string[], amount: string) =>
    sendNotification(playerIds, {
      title: "Payment held",
      body: `${amount} held — released if pool doesn't fill within 48h.`,
      data: { type: "payment_held" },
    }),
};
