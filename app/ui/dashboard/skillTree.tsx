"use client";

import React, { useState } from "react";
import "./SkillTree.css";
import mainTalents from "@/public/MainTalents/MainTalents.json"
interface SkillTreeProps {
    tree: any;
    name: string;
    dpsDiff: Function;
}
import { useSkillTreeDispatch, useSkillTreeState, } from '@/app/lib/Context'
import { parseData } from "@/app/lib/utils";
import { isMobile } from "react-device-detect";

const maxSkills = 25;

const SkillTree = ({ tree, name, dpsDiff }: SkillTreeProps) => {
    const state = useSkillTreeState()
    const dispatch = useSkillTreeDispatch()
    const [diff, setDiff] = useState(null)
    const skillTree: any = state[name];
    const isProd = process.env.NODE_ENV === 'production';

    const skills = tree;
    const nodeSize = isMobile ? 3.5 : 6.5;
    const numOfColumns = name.includes('God') ? 7 : 9;

    const Y = (y: number) => {
        const col = (y - 48) / 96
        const y2 = 7 * (col);
        return y2;
    }

    const X = (x: number) => {
        const col = (x - 64) / 128
        const x2 = 100 / numOfColumns * (col);
        return x2;
    }
    const R = (x: number) => {
        const col = (x - 64) / 128

        return col
    }

    const unlockSkill = (skillId: number, skills: any, tooltip: string) => {
        dispatch({
            skills,
            type: "ALLOCATE_SKILL",
            payload: { skillTreeId: name, skillId: skillId.toString() },
        });
        const stats = parseData(tooltip)
        stats.forEach((stat) => {
            const key = Object.keys(stat)[0]

            dispatch({
                skills,
                type: "DPS_ADD",
                payload: { bucket: key, amount: stat[key] },
            });
        })

    };

    const unallocateSkill = (skillId: number, skills: any, tooltip) => {
        dispatch({
            type: "DEALLOCATE_SKILL",
            skills,
            payload: { skillTreeId: name, skillId: skillId.toString() },
        });
        const stats = parseData(tooltip)
        stats.forEach((stat) => {
            const key = Object.keys(stat)[0]

            dispatch({
                skills,
                type: "DPS_ADD",
                payload: { bucket: key, amount: -stat[key] },
            });
        })
    };

    const [firstTalent, setFirstTalent] = useState(null)
    const [secondTalent, setsecondTalent] = useState(null)
    const [mouseOver, setMouseOver] = useState(null)

    const mouseOverFunc = (e, el) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMouseOver({ name: el.name, descript: el.descript, x: rect.left + window.scrollX - 150 + 32, y: rect.bottom + window.scrollY + 5 })
    }
    const rendermainTalents = () => {
        const name2 = name.replaceAll('_', ' ');
        return (
            <>
                <div className="flex">
                    <div className={"flex w-[50%] justify-center mTalent relative " + (skillTree['skillPointsSpent'] < 1 ? 'greyOut' : '')}>
                        {mainTalents[name2].map((el, index) => (index < 3) &&
                            <img
                                onMouseLeave={() => setMouseOver(null)}
                                onMouseOver={(e) => mouseOverFunc(e, el)}
                                onClick={skillTree['skillPointsSpent'] > 1 ? () => setFirstTalent(el.name) : () => { }}
                                className={"mainTalent " + (firstTalent === el.name ? 'selected' : '')}
                                src={`${isProd ? '/tli-builder' : ''}/MainTalents/${el.imagePath}`} />

                        )}
                    </div>
                    <div className={"flex w-[50%] justify-center mTalent relative " + (skillTree['skillPointsSpent'] < 1 ? 'greyOut' : '')}>
                        {mainTalents[name2].map((el, index) => (index >= 3) &&
                            (<><img
                                onMouseOver={(e) => mouseOverFunc(e, el)}
                                onClick={skillTree['skillPointsSpent'] >= 4 ? () => setsecondTalent(el.name) : () => { }}
                                onMouseLeave={() => setMouseOver(null)}
                                className={"mainTalent " + (secondTalent === el.name ? 'selected' : '')} src={`/MainTalents/${el.imagePath}`} />

                            </>)
                        )}
                    </div>

                </div >
                {mouseOver && <div style={{
                    left: `${mouseOver.x}px`,
                    top: `${mouseOver.y}px`, // Position below the image
                }} className="mTalentHover absolute p-2 border rounded shadow-lg" dangerouslySetInnerHTML={{ __html: `<div class="h3">${mouseOver.name}<\/div>` + mouseOver.descript }}></div>
                }
            </>
        )
    }

    return (

        <>
            {rendermainTalents()}

            <div className="flex-grow relative h-[42vh]">
                <div className="w-full text-center">{state['skillPoints']}|{skillTree['skillPointsSpent']}</div>

                <div className="skill-tree flex-grow ">
                    <svg className="skill-connections absolute top-[24px]" /* style={{ marginBottom: -nodeSize / 2 + 'vw', marginRight: -nodeSize / 2 + 'vw' }} */>
                        {skills.map((skill: { dependencies: any[]; id: any; position: { x: number; y: number; }; }) =>

                            skill.dependencies.map((dep) => {
                                const fromSkill = skills.find((s: { id: any; }) => s.id == dep);
                                return (
                                    <line
                                        key={`${dep}-${skill.id}`}
                                        x1={X(fromSkill.position.x) + (nodeSize / 2) + 'vw'}
                                        y1={Y(fromSkill.position.y) + nodeSize / 2 + 'vh'}
                                        x2={X(skill.position.x) + nodeSize / 2 + 'vw'}
                                        y2={Y(skill.position.y) + nodeSize / 2 + 'vh'}
                                        stroke="yellow"
                                        strokeWidth="4"
                                    />
                                );
                            })
                        )}
                    </svg>
                    <div className="skills relative">
                        {skills.map((skill: { id: number; maxPoints: any; dependencies: any[]; requirement: any; position: { x: number; y: number; }; image: string; tooltip: any; }) => {

                            return (
                                <div
                                    key={skill.id + (state.skillPoints ?? '')}
                                    className={`revealer skill ${skillTree.unlockedSkills && skillTree.unlockedSkills[skill.id] == skill.maxPoints
                                        ? "unlocked"
                                        : skill.dependencies.every(
                                            (dep) =>
                                                skillTree.unlockedSkills[dep] ==
                                                skills.find((s: { id: any; }) => s.id == dep).maxPoints
                                        ) &&
                                            (!skillTree.unlockedSkills[skill.id] ||
                                                skillTree.unlockedSkills[skill.id] < Number(skill.maxPoints)) && R(skill.requirement) * 3 <= skillTree.skillPointsSpent

                                            ? "available"
                                            : "locked"
                                        }`}
                                    onClick={() => (skillTree.unlockedSkills && skillTree.unlockedSkills[skill.id] == skill.maxPoints) ? null : unlockSkill(skill.id, skills, skill.tooltip)}
                                    onContextMenu={(e) => {
                                        e.preventDefault();

                                        if (Object.keys(skillTree.unlockedSkills).map((skil) => {
                                            if (skillTree.unlockedSkills[skil] === undefined) return false;
                                            return (skillTree.unlockedSkills[skil]) && skills[skil].dependencies.includes(skill.id)
                                                || R(skills[skil].requirement) * 3 >= skillTree.skillPointsSpent
                                        }).includes(true)) return
                                        unallocateSkill(skill.id, skills, skill.tooltip)
                                    }}
                                    style={{
                                        left: `${X(skill.position.x)}vw`,
                                        top: Y(skill.position.y) + 'vh',
                                        position: "absolute",
                                        height: nodeSize + 'vh',
                                        width: nodeSize + 'vh',
                                        zIndex: -skill.id + 50,
                                        backgroundImage: `url('/${isProd ? 'tli-builder/' : '' + name}/${skill.image.split('/').pop()}')`
                                    }}
                                    onMouseOver={() => { setDiff(dpsDiff(skill.tooltip)) }}
                                    onMouseLeave={() => setDiff(null)}
                                >
                                    <div className="pointCount">
                                        {skillTree.unlockedSkills[skill.id] || 0}
                                    </div>
                                    <div className="hidden p-2 border rounded shadow-lg">
                                        <div dangerouslySetInnerHTML={{ __html: `${skill.tooltip}` }} />
                                        {diff > 0 && <span className="increaased  "><span style={{ fontSize: 12 }}>+</span>{Number(diff).toFixed(1)}<span style={{ fontSize: 9 }}>%</span></span>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div></>
    );
};

export default SkillTree;