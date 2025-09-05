  import Echo from "laravel-echo";
  import Pusher from "pusher-js";

  window.Pusher = Pusher;

  export const echo = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,   // obligé pour wss://
    authEndpoint: `${import.meta.env.VITE_BACKEND_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    },
  });

  // console.log("Echo instance:", echo);

  // You can now use the `echo` instance to listen for events 