import React from "react";
import "./SearchBar.css";
import { useEffect } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import { useMemo } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { memo } from "react";
import { LOTTIE_URLS } from "../../constants";

const SearchBar = ({ userName, setUserName }) => {
	const searchBoxRef = useRef();
	const inputRef = useRef();
	const crossIconRef = useRef();

	const showCrossIcon = useMemo(
		() => userName.length >= 1,
		[userName],
	);

	const handleChange = useCallback(
		(e) => {
			setUserName(e.target.value);
		},
		[setUserName],
	);

	const playCrossLottie = useCallback((dir) => {
		crossIconRef.current?.play();
		crossIconRef.current.setPlayerDirection(dir);
	}, []);

	const onCrossClick = useCallback(() => {
		setUserName("");
		playCrossLottie(-1);
	}, [playCrossLottie, setUserName]);

	useEffect(() => {
		if (showCrossIcon) {
			inputRef.current.style.width = "600px";
			playCrossLottie(1);
		} else {
			inputRef.current.style.width = "450px";
		}
	}, [playCrossLottie, showCrossIcon]);

	return (
		<div
			ref={searchBoxRef}
			id="input-box"
			class="input-box"
			onClick={() => {
				inputRef.current.style.width = "600px";
			}}
		>
			<i className="uil uil-search"></i>
			<input
				ref={inputRef}
				type="text"
				onChange={handleChange}
				value={userName}
				placeholder="Enter the user name..."
			/>
			{
				<div className="button" onClick={onCrossClick}>
					<Player
						ref={crossIconRef}
						style={{ height: "40px" }}
						keepLastFrame
						src={LOTTIE_URLS.CROSS_ICON}
						speed={2}
					></Player>
				</div>
			}
		</div>
	);
};

export default memo(SearchBar);
