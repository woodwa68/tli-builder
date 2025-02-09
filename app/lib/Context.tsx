import React, { createContext, useContext, useReducer } from "react";
import { determineBucket, DPS_RESERVED_CATEGORIES } from "./utils";
import TAGS from 'public/Tags.json'

type Skill = {
    id: string;
    maxPoints: number;
    cost: number;
    dependencies: string[];
    requirement: number;
};

type SkillTree = {
    skillPointsSpent: number;
    unlockedSkills: Record<string, number | undefined>;
};

type State = {
    skillPoints: number;
    [key: string]: SkillTree | number;
    dps: any;
};

type Action =
    | { type: "ALLOCATE_SKILL"; payload: { skillTreeId: string; skillId: string }; skills: Skill[] }
    | { type: "DEALLOCATE_SKILL"; payload: { skillTreeId: string; skillId: string }; skills: Skill[] };

const SkillTreeStateContext = createContext<State | null>(null);
const SkillTreeDispatchContext = createContext<React.Dispatch<Action> | null>(null);

const ACTION_TYPES = {
    ALLOCATE_SKILL: "ALLOCATE_SKILL",
    DEALLOCATE_SKILL: "DEALLOCATE_SKILL",
    DPS_ADD: "DPS_ADD"
};

const R = (x: number): number => (x - 64) / 128;



const skillTreeReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ACTION_TYPES.ALLOCATE_SKILL: {


            const { skillTreeId, skillId } = action.payload;
            const skillTree = state[skillTreeId] as SkillTree;
            const skill = action.skills.find((s) => s.id == skillId);

            if (!skill) return state

            const canAllocate =
                skill.dependencies.every(
                    (depId) => skillTree.unlockedSkills[depId] == action.skills.find((s) => s.id == depId)?.maxPoints
                ) &&
                (!skillTree.unlockedSkills[skillId] || skillTree.unlockedSkills[skillId]! < skill.maxPoints) &&
                state.skillPoints >= skill.cost &&
                R(skill.requirement) * 3 <= skillTree.skillPointsSpent;

            if (canAllocate) {
                return {
                    ...state,
                    skillPoints: state.skillPoints - skill.cost,
                    [skillTreeId]: {
                        ...skillTree,
                        skillPointsSpent: skillTree.skillPointsSpent + 1,
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
            const skillTree = state[skillTreeId] as SkillTree;
            const skill = action.skills.find((s) => s.id == skillId);

            if (!skill || !skillTree.unlockedSkills[skillId]) return state;

            const dependentSkills = action.skills.filter(
                (s) => s.dependencies.includes(skillId) && skillTree.unlockedSkills[s.id]
            );

            const canDeallocate = dependentSkills.every(
                (dep) => !skillTree.unlockedSkills[dep.id] || skillTree.unlockedSkills[dep.id] === 0
            );

            if (canDeallocate) {
                return {
                    ...state,
                    skillPoints: state.skillPoints + skill.cost,
                    [skillTreeId]: {
                        ...skillTree,
                        skillPointsSpent: skillTree.skillPointsSpent - 1,
                        unlockedSkills: {
                            ...skillTree.unlockedSkills,
                            [skillId]: skillTree.unlockedSkills[skillId]! > 1 ? skillTree.unlockedSkills[skillId]! - 1 : undefined,
                        },
                    },
                };
            }
            return state;
        }
        case ACTION_TYPES.DPS_ADD: {
            const { bucket, amount } = action.payload;
            const match = determineBucket(bucket, state.dps)
            if (match) {
                return {
                    ...state,
                    dps: {
                        ...state.dps,
                        [match.category]: (state['dps'][match.category] ? state['dps'][match.category] : 0) + amount
                    }

                };
            }
            return state
        }
        case "SET_DPS": {


            return {
                ...state,
                dps: {
                    ...state.dps,
                    ...action.payload
                }

            };


        }
        case "SET_SKILL": {
            const { skill } = action.payload;
            return {
                ...state,
                dps: {
                    ...state.dps,
                    skill: skill
                }

            };
        }
        /*   case "skillLevel": {
              const { skillLevel } = action.payload;
              return {
                  ...state,
                  dps: {
                      ...state.dps,
                      skillLevel: skillLevel
                  }
  
              };
          }
          case "baseDamage": {
              const { baseDamage } = action.payload;
              return {
                  ...state,
                  ...action.payload,
              };
          }
          case "baseCrit": {
              const { baseCrit } = action.payload;
              return {
                  ...state,
                  baseCrit,
              };
          }
          case "baseAttackSpd": {
              const { baseAttackSpd } = action.payload;
              return {
                  ...state,
                  baseAttackSpd,
              };
          } */
        default:
            return state;
    }
};

type SkillTreeProviderProps = {
    children: React.ReactNode;
    initialSkillTrees: State;
};

export const SkillTreeProvider = ({ children, initialSkillTrees }: SkillTreeProviderProps) => {
    const [state, dispatch] = useReducer(skillTreeReducer, initialSkillTrees);

    return (
        <SkillTreeStateContext.Provider value={state}>
            <SkillTreeDispatchContext.Provider value={dispatch}>
                {children}
            </SkillTreeDispatchContext.Provider>
        </SkillTreeStateContext.Provider>
    );
};

export const useSkillTreeState = (): State => {
    const context = useContext(SkillTreeStateContext);
    if (context === null) {
        throw new Error("useSkillTreeState must be used within a SkillTreeProvider");
    }
    return context;
};

export const useSkillTreeDispatch = (): React.Dispatch<Action> => {
    const context = useContext(SkillTreeDispatchContext);
    if (context === null) {
        throw new Error("useSkillTreeDispatch must be used within a SkillTreeProvider");
    }
    return context;
};
