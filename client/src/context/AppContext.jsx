import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";
import axios from 'axios';
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ==================================================================
  // FETCH USER — FIXED TOKEN HEADER (NO BEARER)
  // ==================================================================
  const fetchUser = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: token }, // 🔥 FIXED
      });

      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message?.toLowerCase() || error.message;

      if (
        msg.includes("expired") ||
        msg.includes("invalid") ||
        msg.includes("unauthorized")
      ) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        toast.error("Session expired — please login again.");
        return;
      }

      toast.error(error.message);
    } finally {
      setLoadingUser(false);
    }
  };

  // ==================================================================
  // CREATE CHAT — FIXED TOKEN HEADER
  // ==================================================================
  const createNewChat = async () => {
    try {
      if (!user) return toast("Login to create a new chat");
      navigate("/");

      await axios.get("/api/chat/create", {
        headers: { Authorization: token }, // 🔥 FIXED
      });

      await fetchUsersChats();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ==================================================================
  // FETCH ALL CHATS — FIXED TOKEN HEADER
  // ==================================================================
  const fetchUsersChats = async () => {
    try {
      const { data } = await axios.get("/api/chat/get", {
        headers: { Authorization: token }, // 🔥 FIXED
      });

      if (data.success) {
        setChats(data.chats);

        if (data.chats.length === 0) {
          await createNewChat();
          return fetchUsersChats();
        } else {
          setSelectedChat(data.chats[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ==================================================================
  // EFFECTS
  // ==================================================================

  // Load chats when user is available
  useEffect(() => {
    if (user) {
      fetchUsersChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user]);

  // Sync theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch user when token changes
  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }
    fetchUser();
  }, [token]);


  const value = {
    navigate, user, setUser, fetchUser, chats, setChats, selectedChat, setSelectedChat, theme, setTheme, createNewChat, loadingUser, fetchUsersChats, token, setToken, axios
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)