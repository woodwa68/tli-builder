import React, { createContext, useContext, useReducer, useState } from "react";

// Contexts for SkillTree
const SkillTreeStateContext = createContext(null);
const SkillTreeDispatchContext = createContext(null);

const ACTION_TYPES = {
    ALLOCATE_SKILL: "ALLOCATE_SKILL",
    DEALLOCATE_SKILL: "DEALLOCATE_SKILL",
};

// Reducer function
const skillTreeReducer = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.ALLOCATE_SKILL: {
            const { skillTreeId, skillId } = action.payload;
            const skillTree = state[skillTreeId];
            const skill = skillTree.skills.find((s) => s.id === skillId);

            if (!skill) return state; // Skill not found

            const canAllocate =
                skill.dependencies.every(
                    (depId) => skillTree.unlockedSkills[depId] === skillTree.skills.find((s) => s.id === depId).maxPoints
                ) &&
                (!skillTree.unlockedSkills[skillId] || skillTree.unlockedSkills[skillId] < skill.maxPoints) &&
                skillTree.skillPoints >= skill.cost;

            if (canAllocate) {
                return {
                    ...state,
                    [skillTreeId]: {
                        ...skillTree,
                        skillPoints: skillTree.skillPoints - skill.cost,
                        unlockedSkills: {
                            ...skillTree.unlockedSkills,
                            [skillId]: (skillTree.unlockedSkills[skillId] || 0) + 1,
                        },
                    },
                };
            }
            return state;
        }

        case ACTION_TYPES.DEALLOCATE_SKILL: {
            const { skillTreeId, skillId } = action.payload;
            const skillTree = state[skillTreeId];
            const skill = skillTree.skills.find((s) => s.id === skillId);

            if (!skill || !skillTree.unlockedSkills[skillId]) return state; // Skill not found or not allocated

            const dependentSkills = skillTree.skills.filter((s) =>
                s.dependencies.includes(skillId) && skillTree.unlockedSkills[s.id]
            );

            const canDeallocate = dependentSkills.every(
                (dep) => !skillTree.unlockedSkills[dep.id] || skillTree.unlockedSkills[dep.id] === 0
            );

            if (canDeallocate) {
                return {
                    ...state,
                    [skillTreeId]: {
                        ...skillTree,
                        skillPoints: skillTree.skillPoints + skill.cost,
                        unlockedSkills: {
                            ...skillTree.unlockedSkills,
                            [skillId]: skillTree.unlockedSkills[skillId] > 1 ? skillTree.unlockedSkills[skillId] - 1 : undefined,
                        },
                    },
                };
            }
            return state;
        }

        default:
            return state;
    }
};


export const SkillTreeProvider = ({ children, initialSkillTrees }) => {
    const [state, dispatch] = useReducer(skillTreeReducer, initialSkillTrees);

    return (
        <SkillTreeStateContext.Provider value={state}>
            <SkillTreeDispatchContext.Provider value={dispatch}>
                {children}
            </SkillTreeDispatchContext.Provider>
        </SkillTreeStateContext.Provider>
    );
};


export const useSkillTreeState = () => {
    const context = useContext(SkillTreeStateContext);
    if (!context) {
        throw new Error(
            "useSkillTreeState must be used within a SkillTreeProvider"
        );
    }
    return context;
};

export const useSkillTreeDispatch = () => {
    const context = useContext(SkillTreeDispatchContext);
    if (!context) {
        throw new Error(
            "useSkillTreeDispatch must be used within a SkillTreeProvider"
        );
    }
    return context;
};