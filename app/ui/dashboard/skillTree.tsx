"use client";

import React, { useState } from "react";
import "./SkillTree.css";
import { ChildProps } from "postcss";
const maxSkills = 25;


// horiz y = 128x+64
//vert y = 96x +48
// Sample skill data

/* const skills = [
  { id: 1, name: "Skill A", dependencies: [], cost: 1, maxPoints: 3, position: { x: 64, y: row1 }, requirement: 64 },
  { id: 2, name: "Skill B", dependencies: [1], cost: 1, maxPoints: 2, position: { x: X(192), y: row1 }, requirement: R(2) },
 
]; */


const SkillTree = ({ tree, name }: ChildProps) => {
    const [unlockedSkills, setUnlockedSkills] = useState({});
    const [skillPoints, setSkillPoints] = useState(maxSkills);
    const skills = tree;


    const Y = (y: number) => {
        const col = (y - 48) / 96
        const y2 = 100 * (col);
        return 50 + y2;
    }

    const X = (x: number) => {
        const col = (x - 64) / 128
        const x2 = 150 * (col);
        return 50 + x2;
    }
    const R = (x: number) => {
        const col = (x - 64) / 128
        const y = maxSkills - (col) * 3;
        return y
    }

    const canUnlockSkill = (skill) => {
        return (
            skill.dependencies.every(
                (dep) => unlockedSkills[dep] && unlockedSkills[dep] == skills.find((s) => s.id === dep).maxPoints
            ) &&
            (!unlockedSkills[skill.id] || unlockedSkills[skill.id] < skill.maxPoints) &&
            skillPoints >= skill.cost &&
            R(skill.requirement) >= skillPoints
        );
    };

    const unlockSkill = (skill) => {
        if (canUnlockSkill(skill)) {
            setUnlockedSkills((prev) => ({
                ...prev,
                [skill.id]: (prev[skill.id] || 0) + 1,
            }));
            setSkillPoints(skillPoints - skill.cost);
        }
    };

    const unallocateSkill = (skill) => {
        if (unlockedSkills[skill.id]) {
            const dependentSkills = skills.filter((s) =>
                s.dependencies.includes(skill.id) && unlockedSkills[s.id]
            );

            if (dependentSkills.every((dep) => !unlockedSkills[dep.id] || unlockedSkills[dep.id] === 0)) {
                setUnlockedSkills((prev) => ({
                    ...prev,
                    [skill.id]: prev[skill.id] > 1 ? prev[skill.id] - 1 : undefined,
                }));
                setSkillPoints(skillPoints + skill.cost);
            }
        }
    };

    const handleRightClick = (e, skill) => {
        e.preventDefault();
        unallocateSkill(skill);
    };

    return (
        skills &&
        <div className="skill-tree">
            <svg className="skill-connections">
                {skills.map((skill) =>

                    skill.dependencies.map((dep) => {
                        const fromSkill = skills.find((s) => s.id == dep);
                        return (
                            <line
                                key={`${dep}-${skill.id}`}
                                x1={X(fromSkill.position.x) + 60}
                                y1={Y(fromSkill.position.y) + 30}
                                x2={X(skill.position.x) + 60}
                                y2={Y(skill.position.y) + 30}
                                stroke="white"
                                strokeWidth="2"
                            />
                        );
                    })
                )}
            </svg>
            <div className="skills">
                {skills.map((skill) => {
                    console.log(skill.image)
                    return (
                        <div
                            key={skill.id}
                            className={`revealer skill ${unlockedSkills[skill.id] == skill.maxPoints
                                ? "unlocked"
                                : canUnlockSkill(skill)
                                    ? "available"
                                    : "locked"
                                }`}
                            onClick={() => unlockSkill(skill)}
                            onContextMenu={(e) => handleRightClick(e, skill)}
                            style={{
                                left: X(skill.position.x),
                                top: Y(skill.position.y),
                                position: "absolute",
                                zIndex: -skill.id + 50,
                                backgroundImage: `url('/${name}/${skill.image.split('/').pop()}')`
                            }}
                        >
                            <div className="pointCount">
                                {unlockedSkills[skill.id] || 0}
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: `${skill.tooltip}` }} className="hidden"></div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default SkillTree;