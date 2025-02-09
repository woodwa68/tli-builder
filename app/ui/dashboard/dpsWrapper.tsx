"use client";


import { determineBucket, parseData } from "@/app/lib/utils";
import Divinity from "./divinity";
import DpsCalc from "./dpsCalc";
import { Gear } from "./gear";
import Skills from "./skills";
import SkillTree from "./skillTree";
import { useSkillTreeDispatch, useSkillTreeState } from "@/app/lib/Context";
import { useCallback, useMemo } from "react";

export default function DpsWrapper({ param, tree }) {

    const dispatch = useSkillTreeDispatch()
    const state = useSkillTreeState()
    const dps = state.dps;



    const getDpsStat = (category: string, dpsObj: any) => {
        return (dpsObj[category] ? dpsObj[category] / 100 : 0)
    }

    let t;
    let calcFuncs = [];
    const calcskillDamage = (dps: any) => dps.skill &&
        parseInt(dps.skill[dps.skillLevel]["Effectiveness of added damage"].replace('%', '')) / 100;

    const calcBaseDamage = t = (dps: any) => dps.skill && (((dps.baseDamage + dps.minAdded) * calcskillDamage(dps)) + ((dps.baseDamage + dps.maxAdded) * calcskillDamage(dps))) / 2; calcFuncs.push(t);
    const calcAttackSpeed = t = (dps: any) => ((dps.baseAttackSpd) * (1 + getDpsStat('gearAtkSpeed', dps)) * (1 + getDpsStat('attack/cast speed', dps))); calcFuncs.push(t);
    //const calcCritChance = (dps: any) => (getDpsStat('baseCrit', dps)) * (1 + getDpsStat('critical strike rating', dps))
    const calcCritMulti = t = (dps: any) => (((getDpsStat('baseCrit', dps)) * (1 + getDpsStat('critical strike rating', dps)) / 100) *
        (1.5 + getDpsStat('critical strike damage', dps))) + 1 * (1 - (getDpsStat('baseCrit', dps)) * (1 + getDpsStat('critical strike rating', dps)) / 100); calcFuncs.push(t);
    const calcIncDamage = t = (dps: any) => (1 + getDpsStat('increased damage', dps)); calcFuncs.push(t);
    const calcStatDamage = t = (dps: any) => (
        (dps['Dexterity'] ? (1 + (.005 * dps['Dexterity'])) : 1) *
        (dps['Strength'] ? (1 + (.005 * dps['Strength'])) : 1) *
        (dps['Intelligence'] ? (1 + (.005 * dps['Intelligence'])) : 1)
    ); calcFuncs.push(t);
    const calcShadowDamage = t = (dps: any) => (1 + (dps['shadow quantity'] ? (1 + (dps['shadow quantity'] - 1) * .7) : 0)); calcFuncs.push(t);

    /*   let temp;
      const skillDamage = useMemo(() => calcskillDamage(dps), [dps.skill, dps.skillLevel]);
      const tBaseDam = useMemo(() => calcBaseDamage(dps), [dps.baseDamage, dps.maxDamage, dps.minDamage])
      const tAtkSpeed = useMemo(() => { debugger; return calcAttackSpeed(dps) }, [dps.gearAtkSpeed, dps.baseAttackSpd, dps['attack/cast speed']])
      //const critChance = useMemo(() => calcCritChance(dps), [dps['baseCrit']])
      const tCritMulti = useMemo(() => calcCritMulti(dps), [dps['baseCrit'], dps['critical strike rating'], dps['critical strike damage']])
      const tIncDamage = useMemo(() => calcIncDamage(dps), [dps['increased damage']])
      const statDamage = useMemo(() => calcStatDamage(dps), [dps.Dexterity, dps.Strength, dps.Intelligence])
      const shadowDamage = useMemo(() => calcShadowDamage(dps), [dps['shadow quantity']])
  
      const totalDps = useMemo(() => tBaseDam * tAtkSpeed * tCritMulti * tIncDamage * statDamage * shadowDamage,
          [tBaseDam, tAtkSpeed, tCritMulti, tIncDamage, statDamage, shadowDamage]) */

    let temp;
    let dpsBuckets = [];
    //const skillDamage = temp = useMemo(() => calcskillDamage(dps), [dps.skill, dps.skillLevel]); dpsBuckets.push(temp);
    const tBaseDam = temp = useMemo(() => calcBaseDamage(dps), [dps.baseDamage, dps.maxAdded, dps.minAdded, dps.skill, dps.skillLevel]); dpsBuckets.push(temp);
    const tAtkSpeed = temp = useMemo(() => calcAttackSpeed(dps), [dps.gearAtkSpeed, dps.baseAttackSpd, state.dps['attack/cast speed']]); dpsBuckets.push(temp);
    // const critChance = temp = useMemo(() => calcCritChance(dps), [dps['baseCrit'], dps['critical strike rating']]); dpsBuckets.push(temp);
    const tCritMulti = temp = useMemo(() => calcCritMulti(dps), [dps['baseCrit'], dps['critical strike rating'], dps['critical strike damage']]); dpsBuckets.push(temp);
    const tIncDamage = temp = useMemo(() => calcIncDamage(dps), [dps['increased damage']]); dpsBuckets.push(temp);
    const statDamage = temp = useMemo(() => calcStatDamage(dps), [dps.Dexterity, dps.Strength, dps.Intelligence]); dpsBuckets.push(temp);
    const shadowDamage = temp = useMemo(() => calcShadowDamage(dps), [dps['shadow quantity']]); dpsBuckets.push(temp);

    const totalDps = useMemo(() => dpsBuckets.reduce((acc, bucket) => acc * bucket, 1),
        [...dpsBuckets])



    const dpsDiff = useCallback((dpsString: string) => {
        const dps2 = JSON.parse(JSON.stringify(dps))
        dpsString.split('\n').map((segment) => {
            const stats = parseData(segment)
            stats.forEach((stat) => {
                const key = Object.keys(stat)[0]

                const match = determineBucket(key, dps2)
                if (match) {
                    dps2[match.category] = (dps2[match.category] ? dps2[match.category] : 0) + stat[key]
                }
            })

        })

        const dpss = calcFuncs.reduce((acc, f) => acc * f(dps2), 1)

        return (dpss / totalDps - 1) * 100;
    }, [dps, totalDps])

    return (
        <div className="flex relative flex-col h-3000px">

            <SkillTree tree={tree} name={param} dpsDiff={dpsDiff} />
            <Divinity />
            <Skills />
            <DpsCalc dpsBucket={dpsBuckets} />
            <Gear />
        </div>
    )

}