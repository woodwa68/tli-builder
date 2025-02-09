"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import SkillTree from "../ui/dashboard/skillTree";
import { SkillTreeProvider } from "../lib/Context";
import DpsWrapper from "../ui/dashboard/dpsWrapper";

import gom from "@/public/God_of_Might/God_of_Might.json";
import gow from "@/public/God_of_War/God_of_War.json";
import tb from "@/public/The_Brave/The_Brave.json";
import mm from "public/Marksman/Marksman.json";
import mag from "public/Magister/Magister.json";
import sd from "public/Shadowdancer/Shadowdancer.json";
import sm from "public/Shadowmaster/Shadowmaster.json";
import mach from "public/Machinist/Machinist.json";
import goh from "public/Goddess_of_Hunting/Goddess_of_Hunting.json";
import god from "public/Goddess_of_Deception/Goddess_of_Deception.json";
import onsl from "public/Onslaughter/Onslaughter.json";
import br from "public/Bladerunner/Bladerunner.json";
import arcan from "public/Arcanist/Arcanist.json";
import ronin from "public/Ronin/Ronin.json";
import psy from "public/Psychic/Psychic.json";
import steel from "public/Steel_Vanguard/Steel_Vanguard.json";
import gok from "public/Goddess_of_Knowledge/Goddess_of_Knowledge.json";
import goma from "public/God_of_Machines/God_of_Machines.json";
import warl from "public/Warlord/Warlord.json";
import druid from "public/Druid/Druid.json";
import ele from "public/Elementalist/Elementalist.json";
import rang from "public/Ranger/Ranger.json";
import warlock from "public/Warlock/Warlock.json";
import alch from "public/Alchemist/Alchemist.json";

type SkillTreeData = typeof gom;
const trees: Record<string, SkillTreeData> = {
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
    Ronin: ronin,
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
};

type InitialState = Record<
    string,
    { unlockedSkills: Record<string, number>; skillPointsSpent: number }
> & {
    skillPoints: number;
    dps: any;
};

function PageContent() {
    const searchParams = useSearchParams();
    const [param, setParam] = useState<string | null>(null);

    // ✅ Use `useEffect` to safely read search params
    useEffect(() => {
        setParam(searchParams.get("tree"));
    }, [searchParams]);

    if (!param || !(param in trees)) {
        return <div>Invalid or missing skill tree parameter</div>;
    }

    const initState: InitialState = Object.keys(trees).reduce(
        (result, key) => {
            result[key] = { unlockedSkills: {}, skillPointsSpent: 0 };
            return result;
        },
        { skillPoints: 50, dps: {} } as unknown as InitialState
    );

    const tree = trees[param];

    return (
        <SkillTreeProvider initialSkillTrees={initState}>
            <DpsWrapper tree={tree} param={param} />

        </SkillTreeProvider>
    );
}

export default function Page() {
    return (

        <PageContent />

    );
}
