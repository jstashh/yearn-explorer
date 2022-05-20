import Head from "next/head";
import styles from "../styles/Home.module.css";
import Header from "../components/header";
import Search from "../components/search";
import React, { useState } from "react";
import { Router, useRouter } from "next/router";
import { ethers } from "ethers";
import RecentSearches from "../components/recentSearches";
import { useEffect } from "react";
import { classify } from "../classifier";

export default function Home() {
  const [inputs, setInputs] = useState([]);
  const [inputInvalid, setInputInvalid] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    const asdf = JSON.parse(localStorage.getItem("stored-inputs"));
    setInputs(asdf);
  }, []);

  function buttonPressed() {
    var input = value;
    if (input.length == 40) {
      input = "0x" + currentInput;
    }

    try {
      input = ethers.utils.getAddress(input);
      setInputInvalid(false);

      if (inputs.indexOf(input) > -1 === false) {
        const newInputs = [...inputs, input];
        setInputs(newInputs);
        localStorage.setItem("stored-inputs", JSON.stringify(newInputs));
      }

      setValue("");
      navigateToAddress(input);
    } catch (error) {
      console.error(error);
      setInputInvalid(true);
    }
  }

  function navigateToAddress(address) {
    async function work() {
      const classification = await classify(address);
      if (classification === "vault") {
        router.push(`/vault/${address}`);
      } else if (classification === "strategy") {
        router.push(`/strategy/${address}`);
      } else {
        console.log("error goes here..");
      }
    }

    work();
  }

  // function validateInput(input) {
  //   if (input == "" || input == null) {
  //     return false;
  //   }
  //   if (input.length != 42) {
  //     return false;
  //   }
  //   if (!input.startsWith("0x")) {
  //     return false;
  //   }
  //   const regex = new RegExp("^[a-fA-F0-9]+$");
  //   if (!regex.test(input.substring(2))) {
  //     return false;
  //   }
  //   return true;
  // }

  function handleOnChange(event) {
    setValue(event.target.value);
  }

  function closeButtonPressed(address) {
    const newInputs = inputs.filter((input) => input !== address);
    setInputs(newInputs);
    localStorage.setItem("stored-inputs", JSON.stringify(newInputs));
  }

  return (
    <>
      <Search
        buttonPressed={buttonPressed}
        handleOnChange={handleOnChange}
        value={value}
      />
      {inputInvalid ? <p style={{ color: "red" }}>invalid input</p> : <></>}
      <RecentSearches inputs={inputs} closeButtonPressed={closeButtonPressed} />
    </>
  );
}
