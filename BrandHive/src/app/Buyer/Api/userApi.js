import api from "../Api/Api";
import * as SecureStore from "expo-secure-store";

const commonError = (error) => {
  if (error.response) {
    throw new Error(error.response.data?.message || "Something went wrong");
  }

  if (error.request) {
    throw new Error("Server is not responding");
  }

  throw new Error(error.message || "Something went wrong");
};

// ================= LOGIN =================

const LoginApi = async (email, password) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    await SecureStore.setItemAsync("accessToken", response.data.accessToken);

    await SecureStore.setItemAsync("refreshToken", response.data.refreshToken);

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

// ================= REGISTER =================

const RegisterApi = async (username, email, password) => {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

// ================= PROFILE SETUP =================

const profileSetupApi = async (
  firstname,
  surname,
  mobileNumber,
  city,
  state,
  bio,
  profileimage,
) => {
  try {
    const response = await api.post("/auth/profile", {
      firstname,
      surname,
      mobileNumber,
      city,
      state,
      bio,
      profileimage,
    });

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

// ================= VERIFY USER OTP =================

const verifyUser = async (email, otp) => {
  try {
    const response = await api.post("/auth/verify-otp", {
      email,
      otp,
    });

    await SecureStore.setItemAsync("accessToken", response.data.accessToken);

    await SecureStore.setItemAsync("refreshToken", response.data.refreshToken);

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

// ================= FORGOT PASSWORD =================

const forgotPasswordApi = async (email) => {
  try {
    const response = await api.post("/auth/forget-password", {
      email,
    });

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

// ================= VERIFY FORGOT PASSWORD OTP =================

const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post("/auth/verify-forgot-password", {
      email,
      otp,
    });

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

// ================= USER INFO =================

const userInfo = async () => {
  try {
    const response = await api.get("/me");

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

// ================= LOGOUT =================

const logoutApi = async () => {
  await SecureStore.deleteItemAsync("accessToken");
};

// ================= EXPORTS =================

export {
  LoginApi,
  RegisterApi,
  profileSetupApi,
  verifyUser,
  forgotPasswordApi,
  verifyOtp,
  userInfo,
  logoutApi,
};
