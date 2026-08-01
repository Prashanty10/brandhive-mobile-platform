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

const LoginApi = async (email, password, role) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
      role,
    });

    if (response.data?.accessToken) {
      await SecureStore.setItemAsync("accessToken", response.data.accessToken);
    }
    if (response.data?.refreshToken) {
      await SecureStore.setItemAsync("refreshToken", response.data.refreshToken);
    }

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const RegisterApi = async (username, email, password, role) => {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
      role,
    });

    if (response.data?.accessToken) {
      await SecureStore.setItemAsync("accessToken", response.data.accessToken);
    }
    if (response.data?.refreshToken) {
      await SecureStore.setItemAsync("refreshToken", response.data.refreshToken);
    }

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const profileSetupApi = async (profileData) => {
  try {
    const response = await api.put("/auth/profile", profileData);
    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const verifyUser = async (email, otp) => {
  try {
    const response = await api.post("/auth/verify-otp", {
      email,
      otp,
    });

    if (response.data?.accessToken) {
      await SecureStore.setItemAsync("accessToken", response.data.accessToken);
    }
    if (response.data?.refreshToken) {
      await SecureStore.setItemAsync("refreshToken", response.data.refreshToken);
    }

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const forgotPasswordApi = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", {
      email,
    });

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post("/auth/verify-forgot-password", {
      email,
      otp,
    });

    if (response.data?.accessToken) {
      await SecureStore.setItemAsync("accessToken", response.data.accessToken);
    }

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const newPasswordApi = async (password) => {
  try {
    const response = await api.put("/auth/new-password", {
      password,
    });

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const userInfo = async () => {
  try {
    const response = await api.get("/auth/me");

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const logoutApi = async () => {
  try {
    await api.patch("/auth/logout");
  } catch (e) {
  } finally {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
  }
};

export {
  LoginApi,
  RegisterApi,
  profileSetupApi,
  verifyUser,
  forgotPasswordApi,
  verifyOtp,
  newPasswordApi,
  userInfo,
  logoutApi,
};

export default null;
