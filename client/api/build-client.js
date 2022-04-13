import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL: "http://ticketingapp.empirewebdevelopment.com",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
        ...req.headers,
      },
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClient;
