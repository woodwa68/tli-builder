import React, { useEffect, useState } from "react";
import "./skills.css"; // Import the CSS file for styling

import { useSkillTreeDispatch, useSkillTreeState } from "@/app/lib/Context";
//import { skillData } from "@/app/lib/utils";

// Combined App Component
export const Gear = () => {
    const dispatch = useSkillTreeDispatch()
    const state = useSkillTreeState();

    useEffect(() => {
        dispatch({ type: "SET_DPS", payload: { baseDamage: 178 } })
        dispatch({ type: "SET_DPS", payload: { baseAttackSpd: 1.96 } })
        dispatch({ type: "SET_DPS", payload: { baseCrit: 745 } })
        dispatch({ type: 'SET_DPS', payload: { skillLevel: 20 } })
        dispatch({ type: "SET_DPS", payload: { minAdded: 15 } })
        dispatch({ type: "SET_DPS", payload: { maxAdded: 45 } })


    }, [])

    return (
        <div>
            <input type="text" placeholder="baseDamage" onInput={(e) => dispatch({ type: "SET_DPS", payload: { baseDamage: e.currentTarget.value } })}></input>
            <input type="text" placeholder="baseAttackSpd" onInput={(e) => dispatch({ type: "SET_DPS", payload: { baseAttackSpd: e.currentTarget.value } })} ></input>
            <input type="text" placeholder="baseCrit" onInput={(e) => dispatch({ type: "SET_DPS", payload: { baseCrit: e.currentTarget.value } })}></input>
            <input type="text" placeholder="minAdded" onInput={(e) => dispatch({ type: "SET_DPS", payload: { minAdded: e.currentTarget.value } })}></input>
            <input type="text" placeholder="maxAdded" onInput={(e) => dispatch({ type: "SET_DPS", payload: { maxAdded: e.currentTarget.value } })}></input>


        </div>
    );
}