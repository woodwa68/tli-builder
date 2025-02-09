import React, { useEffect, useRef, useState } from "react";
import "./divinity.css";

import { useSkillTreeDispatch } from "@/app/lib/Context";
import { isMobile } from "react-device-detect";

import { Affix_Data, God_Affiliation, God_Affixes, parseData } from "@/app/lib/utils";
import Script from "next/script";

// Define the grid structure
const GRID_TEMPLATE = [
    [
        ["-", null],
        ["-", null],
        ["x", null],
        ["x", null],
        ["-", null],
        ["-", null],
    ],
    [
        ["-", null],
        ["x", null],
        ["x", null],
        ["x", null],
        ["x", null],
        ["-", null],
    ],
    [
        ["x", null],
        ["x", null],
        ["x", null],
        ["x", null],
        ["x", null],
        ["x", null],
    ],
    [
        ["x", null],
        ["x", null],
        ["x", null],
        ["x", null],
        ["x", null],
        ["x", null],
    ],
    [
        ["-", null],
        ["x", null],
        ["x", null],
        ["x", null],
        ["x", null],
        ["-", null],
    ],
    [
        ["-", null],
        ["-", null],
        ["x", null],
        ["x", null],
        ["-", null],
        ["-", null],
    ],
];

// Shapes (Tetris-like)
const SHAPES = {
    square: [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
    ],
    L: [
        [0, 0],
        [1, 0],
        [2, 0],
        [2, 1],
    ],
    tetris: [
        [0, 0],
        [1, 0],

        [1, 1],

        [2, 0],
    ],
    s: [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
    ],
    bigboy: [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
        [0, 1],
        [1, 2],
        [2, 2],
    ],
};

// Function to rotate a shape 90 degrees clockwise
const rotateShape = (shape: any[][]) => {
    return shape.map(([x, y]) => [y, -x]);
};

const Divinity = () => {
    useEffect(() => {
        require("public/DragDropTouch.js")
    }, [])

    const dispatch = useSkillTreeDispatch()
    const [grid, setGrid] = useState<[string | null, any][][]>(
        GRID_TEMPLATE.map((row) => row.map((cell) => [null, null]))
    );
    const [selectedShape, setSelectedShape] = useState('square');
    const [draggingShape, setDraggingShape] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [IsDragging, setIsDragging] = useState(false)
    const [i, setI] = useState(1);
    const isValidPlacement = (rowIndex: any, colIndex: any, shapeCoords: any[]) => {
        return shapeCoords.every(([dx, dy]) => {
            const x = rowIndex + dx;
            const y = colIndex + dy;
            return (
                x >= 0 &&
                x < grid.length &&
                y >= 0 &&
                y < grid[0].length &&
                GRID_TEMPLATE[x][y][0] === "x" &&
                grid[x][y][0] === null
            );
        });
    };

    const handleDrop = (rowIndex: number, colIndex: number) => {
        console.log(3)

        setIsDragging(false)
        if (!draggingShape) return;


        // Normalize shape coordinates (top-left cell as reference)
        const shapeCoords = SHAPES[draggingShape].map(([x, y]) => {
            let rotated = [x, y];
            for (let i = 0; i < rotation; i++) {
                rotated = rotateShape([rotated])[0];
            }
            return rotated;
        });

        const minX = Math.min(...shapeCoords.map(([x]) => x));
        const minY = Math.min(...shapeCoords.map(([_, y]) => y));
        const normalizedShapeCoords = shapeCoords.map(([x, y]) => [
            x - minX,
            y - minY,
        ]);

        // Validate placement
        if (isValidPlacement(rowIndex, colIndex, normalizedShapeCoords)) {
            const newGrid = grid.map((row) => [...row]);
            let index = 0;
            normalizedShapeCoords.forEach(([dx, dy]: [number, number]) => {
                newGrid[rowIndex + dx][colIndex + dy][0] = `${draggingShape}${i}`;
                newGrid[rowIndex + dx][colIndex + dy][1] = pickedAffix;
                if (index === 0) {
                    pickedAffix.map((tooltip) => {
                        const stats = parseData(tooltip)
                        stats.forEach((stat) => {
                            const key = Object.keys(stat)[0]

                            dispatch({
                                type: "DPS_ADD",
                                payload: { bucket: key, amount: stat[key] },
                            });
                        })
                    })

                }
                index++
                // dispatch({type:'DPS_ADD', })
            });
            setI(i + 1);
            setGrid(newGrid);
            // setPickedAffix([])
        }

        setDraggingShape(null);
    };

    const handleRotate = () => {
        setRotation((prevRotation) => prevRotation + 1);
    };

    const renderShape = (shape: string, rotation: number) => {
        const shapeCoords = SHAPES[shape].map(([x, y]) => {
            let rotated = [x, y];
            for (let i = 0; i < rotation; i++) {
                rotated = rotateShape([rotated])[0];
            }
            return rotated;
        });

        const minX = Math.min(...shapeCoords.map(([x]) => x));
        const minY = Math.min(...shapeCoords.map(([_, y]) => y));

        const normalizedCoords = shapeCoords.map(([x, y]) => [x - minX, y - minY]);
        const gridSize = 3;
        const grid = Array.from({ length: gridSize }, () =>
            Array(gridSize).fill(".")
        );

        normalizedCoords.forEach(([x, y]) => {
            grid[x][y] = "x";
        });

        return (
            <div
                className={`shape-preview`}

                style={IsDragging ? {
                    visibility: 'hidden',


                } : {
                    gridTemplateRows: isMobile ? 'repeat(3,  7.25vw)' : 'repeat(3, 4.5vw)'
                }}
            >
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className={`shape-row `} style={{ gridTemplateColumns: isMobile ? 'repeat(3,  7.25vw)' : 'repeat(3, 4.5vw)' }}>
                        {row.map((cell, cellIndex) => (
                            <div
                                key={cellIndex}

                                className={`shape-cell-preview size${square} ${cell === "x" ? "filled" : "empty"
                                    }`}
                            >
                                {rowIndex === 0 && cellIndex === 0 && (
                                    <div

                                        className={`anchor-icon size${square}`}
                                    >
                                        &#x2725;
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [focusedShape, setFocusedShape] = useState(null)

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setMenuPosition(null); // Close the menu if clicked outside
        }
    };

    const prettifyAffix = (affix: string) => {
        return (<>{affix.includes('Legendary') && <span className="text-[6px] pr-2">🟡  </span>}
            {affix.includes('Minor') && <span className="text-[6px]">🔵  </span>}
            {affix.includes('Medium') && !affix.includes('Legendary') && <span className="text-[6px]">🟣  </span>}
            {affix.replace(/<\/?[^>]+(>|$)/g, '').replace(/Minor Talent|Medium Talent|Legendary/g, '').trim()}</>)
    }

    useEffect(() => {
        if (menuPosition) {
            window.addEventListener("click", handleClickOutside);
        } else {
            window.removeEventListener("click", handleClickOutside);
        }

        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, [menuPosition]);



    const handleRightClick = (event: React.MouseEvent, shapeIndex: React.SetStateAction<null>) => {
        event.preventDefault(); // Prevent the browser's default context menu
        setMenuPosition({ x: event.clientX - 240 - 16, y: event.clientY });
        setFocusedShape(shapeIndex)
    };

    const editShape = () => {
        const newGrid = grid.map((row) => [...row]);
        newGrid.map((row, rowIndex) => (
            row.map((cell, colIndex) => {
                if (cell[0] === focusedShape) {
                    cell[1] = null
                    cell[0] = null
                }
            })
        ));
        setGrid(newGrid);
    }

    const deleteShape = () => {
        const newGrid = grid.map((row) => [...row]);
        let index = 0;
        newGrid.map((row, rowIndex) => (
            row.map((cell, colIndex) => {

                if (cell[0] === focusedShape) {

                    if (index === 0) {
                        cell[1].map((tooltip) => {
                            const stats = parseData(tooltip)
                            stats.forEach((stat) => {
                                const key = Object.keys(stat)[0]

                                dispatch({
                                    type: "DPS_ADD",
                                    payload: { bucket: key, amount: -stat[key] },
                                });
                            })
                        })

                    }
                    cell[1] = null
                    cell[0] = null
                    index++
                }
            })
        ));
        setGrid(newGrid);
    }

    const handleMenuOptionClick = (option: string) => {

        if (option === 'Delete') deleteShape()
        if (option === 'Edit') editShape()

        setMenuPosition(null); // Close the menu after selection
    };

    const [selectedSlateGod, setSelectedSlateGod] = useState('God_of_Might')
    const [selectedAffix, setselectedAffix] = useState(null)
    const [showAffixes, setshowAffixes] = useState(null)
    const [AffixFilter, setAffixFilter] = useState(null)
    const [pickedAffix, setPickedAffix] = useState([])

    const getSummary = () => {
        const unique = {}
        grid.map((row, rowIndex) => (
            row.map((cell, colIndex) => {
                if (cell[1] && !unique[cell[0]])
                    unique[cell[0]] = cell[1]
            })
        ))

        return Object.keys(unique).map((i) =>
            <div><span>{JSON.stringify(Affix_Data[unique[i][0]])}</span>
                <span>{JSON.stringify(unique[i])}</span></div>
        )
    }


    useEffect(() => {
        //initDragAndDrop(); // Run drag-and-drop logic
    }, []);

    const formWidth = isMobile ? 48 : 25
    const square = isMobile ? 'Mobile' : 'Web'
    console.log(formWidth)
    return (
        <>
            {showAffixes &&

                <div className="absolute w-full h-[100vh] bg-transparent z-50 p-[2%]">
                    <div className="w-full h-full bg-red-500 z-50 p-[2%] flex flex-col ">
                        <div className="left-[95%] mt-[-11px] absolute" onClick={() => setshowAffixes(false)}>x</div>
                        <div className="w-full flex flex-row  ">Filter<input onInput={(e) => setAffixFilter(e.target.value)} className="w-[50%] text-xs" type="text"></input></div>
                        <div className="w-full h-full z-50 flex flex-row">
                            <div className="flex w-[25%] flex-col flex-wrap gap-1">
                                {Object.keys(God_Affixes[selectedSlateGod]).map((affix) => (

                                    (affix.toLowerCase().includes(AffixFilter) || !AffixFilter) &&
                                    <span key={affix} className="text-xs" onClick={() => {
                                        setPickedAffix([...pickedAffix, affix]); setshowAffixes(false)
                                    }} >
                                        {prettifyAffix(affix)}
                                    </span>
                                ))}

                            </div>
                        </div>

                    </div>
                </div>}
            <div className="divinity flex w-full gap-2 flex-wrap">
                <div className={`flex flex-col gap-2`} style={{ width: formWidth + 'vw' }}>
                    <label className="w-full" >Choose a slate:</label>
                    <form className=" flex w-full items-center" onInput={(e) => { setSelectedSlateGod(e.target.value); setPickedAffix([]) }}>

                        <select className="flex-grow" name="gods" id="gods">
                            {Object.keys(God_Affiliation).map((god) => (
                                <option key={god} value={god}>
                                    {god}
                                </option>
                            ))}
                        </select>
                    </form>
                    {pickedAffix.map((affix) =>
                        <button className="w-full" onClick={() => setshowAffixes(true)}>{prettifyAffix(affix)}</button>

                    )}
                    <button className="w-full" onClick={() => setshowAffixes(true)}>pick affix</button>

                </div>
                <div className={`flex flex-col relative`} style={{ width: formWidth + 'vw' }}>
                    <label className="w-full" >Choose a shape:</label>

                    <form className=" flex w-full items-center" defaultValue={selectedShape} onInput={(e) => setSelectedShape(e.target.value)}>
                        <select className="flex-grow" name="shapes" id="shapes">
                            {Object.keys(SHAPES).map((shape) => (
                                <option key={shape} value={shape}>
                                    {shape}
                                </option>
                            ))}
                        </select>
                    </form>

                    <div className="flex w-full h-[80%] ">

                        <div className="items-center p-6 justify-center flex-grow">
                            {Object.keys(SHAPES).map((shape) => (
                                shape == selectedShape ?
                                    <div
                                        key={shape}
                                        className="shape"
                                        draggable
                                        onDrag={(e) => {
                                            setIsDragging(true)
                                            setDraggingShape(shape);
                                        }}
                                        onTouchStart={(e) => {
                                            setDraggingShape(shape);
                                            // document.body.style.overflow = "hidden";
                                        }}
                                        onTouchEnd={(e) => {
                                            //document.body.style.overflow = "auto";
                                            setIsDragging(false)
                                        }}

                                        onDragEnd={(e) => setIsDragging(false)}
                                    >
                                        {renderShape(shape, rotation)}
                                    </div> : null
                            ))}
                        </div>


                    </div>

                    <button className="absolute top-1/2 left-3/4" onClick={handleRotate}>⏎</button>


                </div>
                {isMobile && <div style={{ width: formWidth + 'vw' }} />}
                <div className={`flex center-items justify-center`} style={{ width: formWidth + 'vw' }}>
                    <div className={`grid `} style={{ gridTemplateRows: isMobile ? 'repeat(6, 7.25vw)' : 'repeat(6, 4.5vw)' }}>
                        {grid.map((row, rowIndex) => (
                            <div key={rowIndex} className={`grid-row`} style={{ gridTemplateColumns: isMobile ? 'repeat(6, 7.25vw)' : 'repeat(6, 4.5vw)' }}>
                                {row.map((cell, colIndex) => (
                                    <div

                                        key={colIndex}
                                        className={`grid-cell size${square} ${GRID_TEMPLATE[rowIndex][colIndex][0] === "x"
                                            ? "valid"
                                            : "invalid"
                                            }`}
                                        onDragOver={(e) => e.preventDefault()}

                                        onDrop={() => handleDrop(rowIndex, colIndex)}
                                    >
                                        {cell[0] && (
                                            <><div
                                                data-name={JSON.stringify(cell[1])}
                                                className={`shape-cell size${square} filled ` + cell[0]}
                                                onContextMenu={(e) => handleRightClick(e, cell[0])}
                                            ></div><div className="hidden"></div></>

                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    {/* <div className="flex flex-col w-[25%] h-full justify-center center-items">
                        <div>Summary</div>
                        {getSummary()}


                    </div> */}
                    {menuPosition && (
                        <div
                            ref={menuRef}
                            style={{
                                position: "absolute",
                                top: menuPosition.y,
                                left: menuPosition.x,
                                backgroundColor: "white",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                zIndex: 1000,
                            }}
                        >
                            <ul style={{ listStyle: "none", margin: 0, padding: "8px 0" }}>
                                {["Delete", "Edit", "Option 3"].map((option) => (
                                    <li
                                        key={option}
                                        onClick={() => handleMenuOptionClick(option)}
                                        style={{
                                            padding: "8px 16px",
                                            cursor: "pointer",
                                            transition: "background 0.2s",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                    >
                                        {option}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div >
        </>
    );
};

export default Divinity;
