import React, { useEffect, useState } from "react";
import "./skills.css"; // Import the CSS file for styling

import { useSkillTreeDispatch, useSkillTreeState } from "@/app/lib/Context";
import { skillData } from "@/app/lib/utils";

// Combined App Component
const Skills = () => {
    const [selectedSkill, setSelectedSkill] = useState({ name: 'Thunder_Spike' });

    const dispatch = useSkillTreeDispatch()
    const state = useSkillTreeState()

    useEffect(() => {
        dispatch({ type: "SET_SKILL", payload: { skill: skillData['Thunder_Spike'] } })

    }, [dispatch])

    // Example data for active and passive skills
    const skills = {
        active: [
            { name: "Ice_Shot", description: "Deals Spell Lightning damage." },
            { name: "Leap_Attack", description: "Deals Spell Lightning damage." },
        ],
        passive: [
            { name: "Passive Skill 1", description: "Increases damage by 10%." },
            { name: "Passive Skill 2", description: "Reduces cooldowns by 15%." },
            { name: "Passive Skill 3", description: "Grants bonus health." },
        ],
    };

    // Example data for support skills
    const supportSkills = [
        { name: "Support Skill 1", description: "Increases damage by 20%." },
        { name: "Support Skill 2", description: "Adds a burn effect." },
        { name: "Support Skill 3", description: "Reduces mana cost." },
        { name: "Support Skill 4", description: "Increases area of effect." },
        { name: "Support Skill 5", description: "Adds a stun effect." },
    ];

    // SkillCard Component
    const SkillCard = ({ skill, onClick, isSelected }) => {
        return (
            <div
                className={`skill-card ${isSelected ? "selected" : ""}`}
                onClick={onClick}
            >
                <h3>{skill.name}</h3>
            </div>
        );
    };

    // SupportSkillCard Component
    const SupportSkillCard = ({ skill }) => {
        return (
            <div className="support-skill-card">
                <h3>{skill.name}</h3>
                <p>{skill.description}</p>
            </div>
        );
    };

    // SkillSelectionPanel Component
    const SkillSelectionPanel = ({ skills, onSkillSelect, selectedSkill }) => {
        return (
            <div className="skill-selection-panel">
                <h2>Active Skills</h2>
                {skills.active.map((skill, index) => (
                    <SkillCard
                        key={index}
                        skill={skill}
                        onClick={() => {
                            onSkillSelect(skill); /* dispatch({ type: "SET_SKILL", payload: { skill: skillData['Thunder_Spike'] }  })*/
                        }}
                        isSelected={selectedSkill === skill}
                    />
                ))}
                <h2>Passive Skills</h2>
                {/*  {skills.passive.map((skill, index) => (
          <SkillCard
            key={index}
            skill={skill}
            onClick={() => onSkillSelect(skill)}
            isSelected={selectedSkill === skill}
          />
        ))} */}
            </div>
        );
    };

    const [skillLevel, setSkillLevel] = useState(20)
    // SkillDetailsPanel Component
    const SkillDetailsPanel = ({ selectedSkill, supportSkills }) => {
        if (!selectedSkill) return null;

        return (
            <div className="skill-details-panel">
                <div className="active-skill-details" key={selectedSkill.name}>
                    <h2>{selectedSkill.name}</h2>
                    <form defaultValue={20} className=" flex w-full items-center" >
                        <label className="w-[50%]" >Choose a level:</label>
                        <select value={skillLevel} className="flex-grow" name="skills" id="gods" onChange={(e) => {
                            setSkillLevel(e.target.value); // Update the state with the selected value
                        }}>
                            {Object.keys(skillData[selectedSkill.name]).map((level) => (
                                parseInt(level) >= 1 ?
                                    <option key={level} value={level}>
                                        {level}
                                    </option> : null
                            ))}
                        </select>
                    </form>
                    {skillLevel && Object.keys(skillData[selectedSkill.name][skillLevel]).map((key) => (
                        key !== 'Descript' && <span><h4>{key}</h4><h4>{skillData[selectedSkill.name][skillLevel][key]}</h4></span>
                    ))}
                </div>

                <div className="support-skills">
                    <h3>Support Skills</h3>
                    {supportSkills.map((skill, index) => (
                        <SupportSkillCard key={index} skill={skill} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="app">
            <SkillSelectionPanel
                skills={skills}
                onSkillSelect={setSelectedSkill}
                selectedSkill={selectedSkill}
            />
            <SkillDetailsPanel
                selectedSkill={selectedSkill}
                supportSkills={supportSkills}
            />
        </div>
    );
};

export default Skills;
