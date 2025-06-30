import Cookies from "js-cookie";

export const logout = () => {
  Cookies.remove("accessToken", {
    secure: true,
    sameSite: "strict",
  });
};
