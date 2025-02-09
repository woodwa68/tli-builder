import React, { useMemo, useState } from "react";
import "./skills.css"; // Import the CSS file for styling
import { useSkillTreeDispatch, useSkillTreeState } from "@/app/lib/Context";
import { DPS_RESERVED_CATEGORIES } from "@/app/lib/utils";

interface DpsCalcProps {

    dpsBucket: any[];

}



export default function DpsCalc({ dpsBucket }: DpsCalcProps) {
    const [tBaseDam, tAtkSpeed, critChance, tCritMulti, totalDps] = dpsBucket;
    console.log(dpsBucket)
    const state = useSkillTreeState()
    const dispatch = useSkillTreeDispatch()

    const dps = state.dps

    const CollapsibleMenu = () => {
        const [isOpen, setIsOpen] = useState(true);

        const toggleMenu = () => {
            setIsOpen(!isOpen);
        };

        if (!dps) return
        return (
            <div className="fixed z-50 bottom-4 right-4">
                {/* Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="relative bg-blue-500 z-50 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
                <div
                    className={`absolute bottom-0 z-40 right-0 bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out w-[500px] ${isOpen ? "h-[500px]" : "h-0"
                        }`}
                >
                    <table>
                        <tbody>
                            <tr><td>base damage</td><td>{dps.baseDamage}</td></tr>
                            <tr><td>Effectiveness of added damage</td><td>{state.dps && state.dps.skill && state.dps.skill[state.dps.skillLevel]["Effectiveness of added damage"]}</td></tr>
                            <tr><td>min/max</td><td>{dps.minAdded}</td><td>{dps.maxAdded}</td></tr>


                            <tr><td>total base damage</td><td>{tBaseDam}</td></tr>

                            <tr><td>base speed</td><td>{dps.baseAttackSpd}</td></tr>
                            <tr><td>base crit</td><td>{dps.baseCrit}</td></tr>
                            <tr><td>{tAtkSpeed}</td></tr>
                            <tr><td>{critChance}</td></tr>
                            <tr><td>{tCritMulti}</td></tr>
                            <tr><td>{totalDps}</td></tr>
                            <tr><th>test</th><th>test</th></tr>
                            {
                                state.dps && state.dps.skill && Object.keys(state.dps).map((bucket) => {
                                    if (bucket === 'skill') return null
                                    return < tr ><td key={bucket}>{bucket}</td><td>{state.dps[bucket]}</td></tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div >
        );
    };

    return (
        CollapsibleMenu())

}

