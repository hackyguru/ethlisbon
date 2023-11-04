import React from 'react'
import { useState } from "react";
import { useAccount } from 'wagmi'
import styles from "@/styles/Home.module.css";

export default function TopBar() {
    const { address, isConnecting, isDisconnected } = useAccount()


	const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
		useState(false);
	const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);

	const closeAll = () => {
		setIsNetworkSwitchHighlighted(false);
		setIsConnectHighlighted(false);
	};
  return (
    <header>
    <div
        className={styles.backdrop}
        style={{
            opacity:
                isConnectHighlighted || isNetworkSwitchHighlighted
                    ? 1
                    : 0,
        }}
    />
    <div className={styles.header}>
        <div className={styles.logo}>
            LOGO
        </div>
        <div className={styles.buttons}>
            <div
                onClick={closeAll}
                className={`${styles.highlight} ${
                    isNetworkSwitchHighlighted
                        ? styles.highlightSelected
                        : ``
                }`}
            >
                <w3m-network-button />
            </div>
            <div
                onClick={closeAll}
                className={`${styles.highlight} ${
                    isConnectHighlighted
                        ? styles.highlightSelected
                        : ``
                }`}
            >
                <w3m-button />
            </div>
        </div>
    </div>
</header>
  )
}
