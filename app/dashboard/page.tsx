'use client'

import { useSearchParams } from "next/navigation";
import SkillTree from "../ui/dashboard/skillTree";
import gom from "@/public/God_of_Might/God_of_Might.json"
import gow from "@/public/God_of_War/God_of_War.json"
import tb from "@/public/The_Brave/The_Brave.json"
import mm from 'public/Marksman/Marksman.json'
import mag from 'public/Magister/Magister.json'
import sd from 'public/Shadowdancer/Shadowdancer.json'
import sm from 'public/Shadowmaster/Shadowmaster.json'
import mach from 'public/Machinist/Machinist.json'
import goh from 'public/Goddess_of_Hunting/Goddess_of_Hunting.json'
import god from 'public/Goddess_of_Deception/Goddess_of_Deception.json'
import onsl from 'public/Onslaughter/Onslaughter.json'
import br from 'public/Bladerunner/Bladerunner.json'
import arcan from 'public/Arcanist/Arcanist.json'
import ronin from 'public/Ronin/Ronin.json'
import psy from 'public/Psychic/Psychic.json'
import steel from 'public/Steel_Vanguard/Steel_Vanguard.json'
import gok from 'public/Goddess_of_Knowledge/Goddess_of_Knowledge.json'
import goma from 'public/God_of_Machines/God_of_Machines.json'
import warl from 'public/Warlord/Warlord.json'
import druid from 'public/Druid/Druid.json'
import ele from 'public/Elementalist/Elementalist.json'
import rang from 'public/Ranger/Ranger.json'
import warlock from 'public/Warlock/Warlock.json'
import alch from 'public/Alchemist/Alchemist.json'
import { useReducer } from "react";

import { SkillTreeProvider } from "../lib/Context";



export default function Page(
) {
    const search = useSearchParams()
    const trees = {

        God_of_Might: gom,
        God_of_War: gow,
        The_Brave: tb,
        Marksman: mm,
        Magister: mag,
        Shadowdancer: sd,
        Shadowmaster: sm,
        Machinist: mach,
        Goddess_of_Hunting: goh,
        Goddess_of_Deception: god,
        Onslaughter: onsl,
        Bladerunner: br,
        Arcanist: arcan,
        Roning: ronin,
        Psychic: psy,
        Steel_Vanguard: steel,
        God_of_Machines: goma,
        Goddess_of_Knowledge: gok,
        Warlord: warl,
        Druid: druid,
        Elementalist: ele,
        Ranger: rang,
        Warlock: warlock,
        Alchemist: alch,
    }


    return (
        <SkillTreeProvider initialSkillTrees={{}} >
            <div className="absolute">
                <SkillTree tree={trees[`${search.get('tree')}`]} name={`${search.get('tree')}`} />
            </div>
        </SkillTreeProvider>)


}

function tasksReducer(tasks, action) {
    switch (action.type) {
        case 'added': {
            return [...tasks, {
                id: action.id,
                text: action.text,
                done: false
            }];
        }
        case 'changed': {
            return tasks.map(t => {
                if (t.id === action.task.id) {
                    return action.task;
                } else {
                    return t;
                }
            });
        }
        case 'deleted': {
            return tasks.filter(t => t.id !== action.id);
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

let nextId = 3;
const initialTasks = [
    { id: 0, text: 'Philosopher’s Path', done: true },
    { id: 1, text: 'Visit the temple', done: false },
    { id: 2, text: 'Drink matcha', done: false }
];
