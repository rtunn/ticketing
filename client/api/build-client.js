import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL: "http://ticketingapp.empirewebdevelopment.com",
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClient;
