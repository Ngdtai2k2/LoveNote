import { useContext } from "react";
import { SocketContext } from "../createContext";

export const useSocketContext = () => useContext(SocketContext);
