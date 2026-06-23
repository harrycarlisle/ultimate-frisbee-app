function jobText(v){return typeof v==="function"?v():v||""}
function roleNote(p,t){return `${p.name}, ${t}`}
function pullFJobs(step){
 const n=name;
 const jobs={
  8:`stay connected, but be ready to cut to the open break side if the disc swings back through ${n("B")} to ${n("A")}.`,
  9:`stay ready and keep watching the disc. Watch ${n("D")}'s cut, but do not leave the stack too early.`,
  10:`hold the stack shape and watch the disc. ${n("D")} is waiting on ${n("C")}'s catch.`,
  11:`watch the disc and ${n("D")}'s fake. Stay patient and do not cut too early.`,
  12:`watch ${n("D")}'s cut and hold your lane. Do not crowd the active cutter.`,
  13:`keep watching ${n("D")}. Stay ready if the disc swings back your way.`,
  14:`watch ${n("C")} read ${n("D")}. Hold the stack and do not cut early.`,
  15:`watch ${n("D")} check ${n("C")} upfield. Stay back and be ready if the disc swings.`,
  16:`watch ${n("C")} clear and ${n("E")} go. Hold shape and be ready if the angle changes.`,
  17:`watch ${n("E")} become the live option. Stay patient and do not crowd the lane.`,
  18:`watch ${n("E")}. If ${n("E")} gets looked off, cut over fast so ${n("D")} has another option.`,
  19:`hold the shape behind ${n("E")} and ${n("G")}. Stay ready, but do not crowd the scoring lane.`,
  20:`prepare to cut up toward the end zone, then break right like an L cut if ${n("G")} is defended hard.`,
  21:`stay out of ${n("G")}'s scoring lane. ${n("E")} is leading the throw.`,
  22:`hold the shape behind the score. Let ${n("G")} finish the point.`
 };
 return jobs[step]||"";
}
function pullFBody(step,p){const note=pullFJobs(step);return note?roleNote(p,note):""}
function pullEarlyBody(step,p){
 const early={
  0:{A:"read the pull and get to the disc early. Settle it before the first throw.",B:`track the pull and peel wide as the outlet for ${name("A")}.`,C:`climb into stack order. You will cut after ${name("A")} and ${name("B")} settle the disc.`,D:`${stackNeighborText("D")} Hold your stack spot until ${name("C")}'s cut starts.`,E:`${stackNeighborText("E")} Stay central and get organized.`,F:`${stackNeighborText("F")} Do not drift into the first cutting lane.`,G:`${stackNeighborText("G")} Stay patient at the back of the stack.`},
  1:{A:"read the pull and get to the disc early. Settle it before the first throw.",B:`peel wide and be ready for ${name("A")}'s first pass.`,C:`keep climbing into stack order. Wait for ${name("A")} and ${name("B")} to settle the disc.`,D:`${stackNeighborText("D")} Hold your stack spot until ${name("C")}'s cut starts.`,E:`${stackNeighborText("E")} Stay central and watch the handlers settle.`,F:`${stackNeighborText("F")} Hold the back-left space and keep the lane clear.`,G:`${stackNeighborText("G")} Hold the back-right space and stay patient.`},
  2:{A:`you have the disc. Look to ${name("B")} first and make the easy throw. After you throw, let the next cutter use the lane.`,B:`stay wide and ready. ${name("A")} is settling the disc.`,C:`hold the front of the stack. You will cut after ${name("A")} and ${name("B")} settle the disc.`,D:`${stackNeighborText("D")} Wait until ${name("C")}'s cut starts.`,E:`${stackNeighborText("E")} Stay central and watch the first handler pass.`,F:`${stackNeighborText("F")} Do not drift into the first cutting lane.`,G:`${stackNeighborText("G")} Stay patient at the back of the stack.`},
  3:{A:`hold your spot. ${name("B")} has the disc now, so your job is to keep the stack spaced.`,B:"you have the disc. Read the stack and be ready for the first cut.",C:`wait at the front. Be ready for your first cut once ${name("B")} reads the force.`,D:`${stackNeighborText("D")} Wait until ${name("C")}'s cut starts.`,E:`${stackNeighborText("E")} Hold the middle lane and watch the first cut develop.`,F:`${stackNeighborText("F")} Hold the back-left space and keep the lane open.`,G:`${stackNeighborText("G")} Hold the back-right space and stay patient.`}
 };
 const note=early[step]?.[player];
 return note?roleNote(p,note):"";
}
function pullKiraBody(step,s,p){
 const kira={
  4:()=>`stay behind ${name("B")} as the reset. Let ${name("C")} have the whole first lane.`,
  5:()=>`hold the reset lane while ${name("C")} sells the fake. Do not creep into the cut.`,
  6:()=>`stay easy under ${name("B")}. If ${name("C")} is covered, you are the outlet.`,
  7:()=>`keep drifting with the disc as the reset. ${name("B")} is reading ${name("C")}.`,
  8:()=>`trail the throw and stay behind the play. ${name("C")} needs room to catch moving.`,
  9:()=>`slide underneath ${name("C")} as the next safety valve.`,
  10:()=>`hold the reset lane while ${name("D")} waits. Keep the middle clear.`,
  11:()=>`stay quiet behind the disc so ${name("D")}'s fake has space.`,
  12:()=>`stay underneath and leave ${name("D")} the whole continuation lane.`,
  13:()=>`be the bailout behind the play while ${name("C")} checks ${name("D")}.`,
  14:()=>`follow the throw as handler help. Do not chase into ${name("D")}'s lane.`,
  15:()=>`stay under ${name("D")} as the reset while ${name("C")} checks the end zone.`,
  16:()=>`stay ready as the reset shape while ${name("C")} clears.`,
  17:()=>`hold underneath and let ${name("E")} own the next lane.`,
  18:()=>`follow the play as the trailing reset. ${name("E")} is becoming the thrower.`,
  19:()=>`stay under the sideline throw and keep the reset alive behind ${name("E")}.`,
  20:()=>`hold underneath while ${name("G")} goes first. Do not take the lane back.`,
  21:()=>`stay under the throw. If ${name("G")} is covered, the reset is yours.`,
  22:()=>`trail the score and stay out of ${name("G")}'s finish lane.`,
  23:()=>`come underneath now. Give ${name("E")} the safe reset if the upfield shot is covered.`,
  24:"catch the reset in balance and turn to the middle.",
  25:()=>`look to swing and wait for ${name("B")} to get wide.`,
  26:()=>`after the swing, stay under ${name("B")} as the new reset.`,
  27:()=>`hold the dump lane while ${name("F")} reads the new break side.`,
  28:()=>`stay underneath and let ${name("F")} attack the lane the swing opened.`,
  29:()=>`trail behind the throw as the safety valve. ${name("G")} is next.`,
  30:()=>`hold the reset lane while ${name("G")} cuts to score.`,
  31:()=>`stay ready underneath. ${name("F")} can use you if ${name("G")} is covered.`,
  32:()=>`hold shape behind the score and stay ready if the thrower looks it off.`,
  33:()=>`you have the disc again. Stay calm and look to restart through ${name("B")}.`
 };
 const early={
  0:"read the pull and get to the disc early. Settle it before the first throw.",
  1:"read the pull and get to the disc early. Settle it before the first throw.",
  2:()=>`you have the disc. Look to ${name("B")} first and make the easy throw. After you throw, let the next cutter use the lane.`,
  3:()=>`hold your spot. ${name("B")} has the disc now, so your job is to keep the stack spaced.`
 };
 const note=jobText(early[step]||kira[step]);
 return note?roleNote(p,note):"";
}
function pullHoldJob(step,id){return jobText(pullHoldJobs[step]?.[id])}
function pullActiveJob(step,id){return jobText(pullActiveJobs[step]?.[id])}
function cupJob(step,id){return jobText(cupJobs[step]?.[id])}
function hoJob(step,id){return jobText(hoJobs[step]?.[id])}

const pullActiveJobs={
 4:{B:"feel the force. The flick side is the open side."},
 5:{
  B:"hold the disc and watch the fake. Do not throw yet.",
  C:"sell down-left first. Make the defender lean before you plant.",
  D:()=>`wait. This is ${name("C")}'s lane.`
 },
 6:{
  B:()=>`pivot right and decide if ${name("C")} has separation.`,
  C:"plant and cut hard back to the right.",
  D:()=>`keep waiting until ${name("C")}'s cut is decided.`
 },
 7:{
  B:()=>`read ${name("C")}. Throw only if the lane is clean.`,
  C:"finish the cut and show whether you are open."
 },
 8:{
  B:()=>`throw to ${name("C")} only if ${name("C")} is clearly open.`,
  C:"run through the catch on the open branch."
 },
 9:{C:"catch, turn, and look upfield before the next cut starts."},
 10:{D:()=>`watch ${name("C")}'s catch. Do not leave early.`},
 11:{
  C:"stay balanced and keep your eyes upfield.",
  D:"sell the fake first. Make the defender move."
 },
 12:{
  C:"read the continuation lane. Do not throw early.",
  D:()=>`plant and cut upfield after ${name("C")} is ready.`,
  E:()=>`stay in the stack. This is still ${name("D")}'s lane.`
 },
 13:{
  C:()=>`throw only if ${name("D")} is clearly ahead.`,
  D:"keep running until the separation is obvious."
 },
 14:{
  C:()=>`throw to ${name("D")} only if the lane is clean.`,
  D:"run through the continuation catch."
 },
 15:{
  C:"keep moving upfield after the throw. Do not drop back yet.",
  D:()=>`catch and check ${name("C")} upfield first. Throw only if the return lane is clean.`
 },
 16:{
  B:()=>`stay available behind the disc while ${name("C")}'s look clears.`,
  C:"if you are covered, keep going and L-cut to the back of the stack.",
  D:()=>`look ${name("C")} off if the defender is tight. Do not force the return throw.`,
  E:()=>`start as soon as ${name("C")} is looked off and clearing. This is your cue to go.`
 },
 17:{
  D:()=>`read ${name("E")} after ${name("C")} clears. Do not force it through traffic.`,
  E:()=>`you are now the live option in the lane ${name("C")} cleared.`
 },
 18:{
  D:()=>`you have the disc. Look for ${name("E")} moving into the lane.`,
  E:()=>`cut into the next lane and show ${name("D")} the wide target.`
 },
 19:{
  B:()=>`move upfield behind the play and stay available as help.`,
  D:()=>`lead ${name("E")} wide with a curved throw.`,
  E:()=>`move wide and catch ${name("D")}'s lead pass.`,
  G:()=>`get ready. ${name("E")} is catching wide, and your cut is about to start.`
 },
 20:{
  B:"keep moving upfield behind the play. Stay ready as help.",
  E:()=>`turn upfield and see ${name("G")}'s cut.`,
  G:()=>`go upfield first, then break hard right. Make the defender chase.`
 },
 21:{
  B:"hold the helper shape behind the play.",
  E:()=>`release early. Lead ${name("G")} into space.`,
  G:()=>`keep running. ${name("E")} is leading the disc into your path.`
 },
 22:{
  E:()=>`put the disc where ${name("G")} is running, not where they started.`,
  G:"run onto the disc and catch it inbounds."
 },
 23:{E:()=>`if the upfield throw is not clean, use ${name("A")} underneath right away.`},
 27:{F:"read the swing and wait for the new break lane."},
 28:{F:"cut hard into the break-side lane the swing opened."},
 29:{
  B:()=>`throw to ${name("F")} only if the break lane stays clean.`,
  F:"catch moving and look upfield for the next cut."
 },
 30:{
  F:()=>`see ${name("G")} first. If the lane closes, keep ${name("A")} underneath.`,
  G:()=>`attack the end zone after ${name("F")} wins the break side.`
 },
 31:{
  F:()=>`you have two safe choices: ${name("G")} if clean, ${name("A")} if not.`,
  G:()=>`keep cutting to space so ${name("F")} can throw early.`
 },
 32:{
  F:()=>`lead ${name("G")} into space if the scoring lane is clean.`,
  G:"run onto the throw and finish inbounds."
 },
 33:{F:"if the break throw is covered, clear hard and let the reset start again."}
};

const pullHoldJobs={
 4:{
  C:"feel the force from the front of the stack. Your fake starts next.",
  D:()=>`hold behind ${name("C")} and wait for the first lane to open.`,
  E:()=>`stay central and keep ${name("D")}'s lane clean.`,
  F:"keep the back-left space and watch the force settle.",
  G:"stay patient at the back and see which side opens."
 },
 5:{
  E:()=>`stay in line and do not jump into ${name("C")}'s fake lane.`,
  F:()=>`hold the back-left space and watch ${name("C")}'s fake work.`,
  G:()=>`watch ${name("C")}'s fake from the back. Do not step into traffic.`
 },
 6:{
  E:()=>`stay stacked behind ${name("D")}. The first cut is still ${name("C")}'s.`,
  F:()=>`keep the back-left lane clean while ${name("C")} drives wide.`,
  G:()=>`see whether ${name("C")} wins outside, but keep the stack still.`
 },
 7:{
  D:()=>`stay loaded as the next cutter. Go only if ${name("C")} is covered.`,
  E:()=>`wait in the middle. ${name("D")} is next if the throw is not there.`,
  F:"watch the read and keep the back-left lane empty.",
  G:"stay patient at the back and watch whether the first throw goes."
 },
 8:{
  D:()=>`get set as the next cutter while the disc travels to ${name("C")}.`,
  E:()=>`hold your space and wait for ${name("C")}'s catch to set the next lane.`,
  G:()=>`watch the throw reach ${name("C")}. Do not creep forward yet.`
 },
 9:{
  B:()=>`stay behind the new thrower as the reset. Keep the angle easy.`,
  D:()=>`watch ${name("C")} turn upfield. Your setup starts after the catch is secure.`,
  E:()=>`stay in the stack and leave room for ${name("D")}'s setup.`,
  G:()=>`watch the mark arrive on ${name("C")}. You are still the back anchor.`
 },
 10:{
  B:()=>`hold the reset a step behind ${name("C")}.`,
  C:()=>`stay calm with the disc and wait for ${name("D")}'s fake to matter.`,
  E:()=>`hold the middle and do not leave before ${name("D")} moves the defender.`,
  G:()=>`stay patient at the back while ${name("D")} times the next cut.`
 },
 11:{
  B:()=>`stay behind the disc as the safe outlet if ${name("D")} is covered.`,
  E:()=>`stay in line. ${name("D")} still owns this lane.`,
  G:()=>`keep the back of the stack quiet while ${name("D")} sells the fake.`
 },
 12:{
  B:"hold the reset and let the throw go only if the lane is clean.",
  G:()=>`watch ${name("D")} go upfield, but keep the back of the stack spaced.`
 },
 13:{
  B:()=>`stay underneath as the bailout while ${name("D")} wins separation.`,
  E:()=>`wait one more beat. Your lane opens only after ${name("D")} is decided.`,
  G:()=>`watch the continuation lane form, but keep your spot at the back.`
 },
 14:{
  B:()=>`stay behind the throw as the easy reset for ${name("D")}.`,
  E:()=>`hold central spacing. ${name("C")} still has to clear behind you.`,
  G:()=>`stay tall at the back because ${name("C")} is clearing to your side.`
 },
 15:{
  B:()=>`stay behind ${name("D")} so the safe reset is still there.`,
  E:()=>`watch ${name("C")}'s end-zone cut, but do not start until it dies.`,
  G:()=>`hold still at the back. ${name("C")} is cutting off your shoulder.`
 },
 16:{G:()=>`stay put while ${name("C")} clears behind you and ${name("E")} takes the next lane.`},
 17:{
  B:()=>`stay behind the disc as the reset while ${name("E")} takes the live lane.`,
  C:()=>`finish your clear and stay behind ${name("G")} at the back.`,
  G:()=>`watch ${name("E")} become live, but stay back until the next throw.`
 },
 18:{
  B:"hold under the disc and wait for the next continuation.",
  C:()=>`stay cleared out at the back so ${name("E")} has space to run.`,
  G:()=>`start reading the next cut, but stay back until ${name("E")} catches wide.`
 },
 19:{C:"stay deep behind the play and keep the throw lane wide open."},
 20:{
  C:()=>`hold behind the play and do not cross into ${name("G")}'s scoring lane.`,
  D:()=>`follow as support and stay out of ${name("G")}'s break lane.`
 },
 21:{
  C:"stay behind the play so the score lane stays open.",
  D:"trail underneath and be ready if the disc comes back."
 },
 22:{
  B:"hold helper shape behind the score in case the catch pops out.",
  C:()=>`stay behind the play and let ${name("G")} finish.`,
  D:"follow the throw and stay out of the end-zone lane."
 },
 23:{
  B:()=>`stay wide behind ${name("E")} so the reset can keep swinging.`,
  C:"stay deep and do not drag your defender back to the disc.",
  D:"hold upfield support and keep the middle clean for the reset.",
  F:"stay patient. Your break-side read starts after the reset.",
  G:"clear the scoring lane if you are covered. Do not hang in front of the disc."
 },
 24:{
  B:()=>`get wide early. You are the next swing once ${name("A")} turns.`,
  C:"stay deep and leave the middle free for the swing.",
  D:"hold upfield support and do not call for the disc underneath.",
  E:()=>`clear wide after the reset and give ${name("A")} room to turn.`,
  F:"hold your depth. The swing to you is not on yet.",
  G:"finish your clear and stay away from the reset lane."
 },
 25:{
  B:()=>`get set wide as the swing target for ${name("A")}.`,
  C:"stay deep and keep the weak side open.",
  D:"hold the far lane and let the disc change sides first.",
  E:"stay central as the next continuation if the swing keeps going.",
  F:"wait for the swing to change the angle before you cut.",
  G:"hold far side and keep the next score lane long."
 },
 26:{
  B:"receive the swing and face the break side.",
  C:()=>`stay deep and out of ${name("F")}'s lane.`,
  D:"stay back and keep the new break lane clear.",
  E:"hold middle support while the swing lands.",
  F:"read the new angle, but do not go until the disc settles.",
  G:"stay far side and wait for the next continuation cue."
 },
 27:{
  B:()=>`hold the disc and wait for ${name("F")} to read the new break lane.`,
  C:"stay deep and keep the weak side empty.",
  D:"hold back and do not cross under the swing.",
  E:"stay central and be ready if the break throw lands.",
  G:"hold far side and start reading the next score cut."
 },
 28:{
  B:()=>`read ${name("F")} and keep the throw simple.`,
  C:"clear the weak side so the break lane stays wide.",
  D:()=>`stay behind ${name("F")} so the break lane stays clean.`,
  E:"keep the middle clear so the break throw stays easy.",
  G:()=>`wait wide. Your cut starts only after ${name("F")} secures the break side.`
 },
 29:{
  A:()=>`trail behind the throw as the safety valve. ${name("G")} is next.`,
  C:"stay deep and leave the scoring lane long.",
  D:()=>`hold support behind ${name("F")} and get out of ${name("G")}'s lane.`,
  E:"wait behind the play. You are next only if it resets again.",
  G:()=>`get set as the next cutter while ${name("F")} turns.`
 },
 30:{
  B:()=>`hold wide as the back swing if ${name("F")} cannot hit ${name("G")}.`,
  C:()=>`hold the back of the stack and do not cross ${name("G")}'s lane.`,
  D:"trail inside and stay out of the scoring lane.",
  E:()=>`stay central and do not crowd ${name("G")}'s cut.`
 },
 31:{
  B:()=>`stay wide behind ${name("F")} so the swing is still easy.`,
  C:"stay deep and let the thrower read cleanly.",
  D:"hold support and do not crowd the reset.",
  E:"hold middle balance behind the two options."
 },
 32:{
  B:"hold shape behind the score and stay ready if it comes back.",
  C:"stay behind the score and keep the lane clean.",
  D:"follow behind the play and do not run to the goal line.",
  E:"trail the score from behind the play."
 },
 33:{
  B:"get wide again so the reset can keep moving.",
  C:()=>`stay deep and let ${name("E")} be the next lane.`,
  D:"reset far-side spacing for the next read.",
  E:"be ready as the next lane once the disc comes back.",
  G:"reset deep spacing if the score throw is not there."
 }
};

const cupJobs={
 0:{
  A:()=>`the cup has you trapped. Stay calm and wait for ${name("D")} in the gap.`,
  B:()=>`stay behind and wide as ${name("A")}'s easy reset.`,
  C:"hold the high right space. Your flood comes later.",
  D:"find the soft spot before the cup resets.",
  E:"hold the middle-right lane. Your setup starts after the first break.",
  F:"stay central and keep the shape behind the cup.",
  G:"stay deep and do not flood right yet."
 },
 1:{
  A:()=>`hold the disc and watch ${name("D")}'s fake move the cup.`,
  B:"keep the reset lane open and short.",
  C:"stay high and patient on the right side.",
  D:"fake up first and make the cup take a step.",
  E:"hold your lane and do not start early.",
  F:"keep the middle balanced behind the play.",
  G:"stay deep and read the right side."
 },
 2:{
  A:()=>`throw as soon as ${name("D")} opens. Do not wait for the cup to recover.`,
  B:"stay ready for the dump if the seam closes.",
  C:"hold right-side spacing so the gap stays clean.",
  D:"cut hard down through the seam and show a big target.",
  E:()=>`pause and leave ${name("D")} the whole middle.`,
  F:"keep backside shape and stay out of the gap.",
  G:"stay deep and keep the help defender occupied."
 },
 3:{
  A:()=>`release through the gap early, then trail behind ${name("D")} as the reset.`,
  B:"move with the play and stay behind the new thrower.",
  C:"keep the right lane empty. The flood is still coming later.",
  D:"catch moving and turn right away.",
  E:()=>`be ready to start your setup cut from ${name("D")}.`,
  F:"hold the middle depth and keep the lane clean.",
  G:"stay tall and wait for the right-side flood cue."
 },
 4:{
  A:()=>`trail under the disc and stay available behind ${name("D")}.`,
  B:"hold reset width behind the play.",
  C:()=>`keep the right lane empty so ${name("E")} can cross it later.`,
  D:()=>`hold the disc and watch ${name("E")} pull the defender left.`,
  E:"sell left first and make the defender commit.",
  F:"keep central shape and do not drift into the cut.",
  G:"stay deep and wait to flood right."
 },
 5:{
  A:()=>`stay behind the disc for the bailout if ${name("D")} does not like the look.`,
  B:"keep helper shape and do not crowd the pivot.",
  C:"stay high on the right. Your flood comes after the catch.",
  D:()=>`read ${name("E")} breaking right and take the easy window.`,
  E:"plant and burst right before the defender recovers.",
  F:"keep the middle occupied so help cannot jump the lane.",
  G:"lean right, but wait one more beat."
 },
 6:{
  A:"trail under and keep the reset alive.",
  B:"slide behind the disc and stay open as support.",
  C:()=>`be ready to flood right as soon as ${name("E")} secures the catch.`,
  D:"throw the easy pass and keep moving behind play.",
  E:"catch on the right shoulder and turn upfield.",
  F:"hold center so the right side stays clear.",
  G:()=>`get ready to flood right off ${name("E")}'s turn.`
 },
 7:{
  A:"stay underneath the play as the safety valve.",
  B:()=>`slide behind ${name("E")} and be the reset if the right side closes.`,
  C:"flood the right sideline and stay wide for the score.",
  D:"trail behind play and do not crowd the next throw.",
  E:"look right before the cup can rebuild.",
  F:"hold middle shape and keep the lane empty.",
  G:"flood right as the second scoring option."
 },
 8:{
  A:"stay under and do not drag a defender into the throw.",
  B:()=>`stay behind ${name("E")} for the safe reset.`,
  C:"keep running wide so the disc can lead you.",
  D:"keep trailing support and stay out of the right lane.",
  E:"throw to the clean right-side option fast.",
  F:"hold the middle in case the throw is looked off.",
  G:"keep your flood alive as the second target."
 },
 9:{
  A:()=>`trail the score and stay out of ${name("C")}'s finish lane.`,
  B:"hold under shape in case the catch pops loose.",
  C:"catch in stride and finish inbounds.",
  D:"follow as the outlet for the next point.",
  E:()=>`you moved it before the cup reset. Hold shape after the throw.`,
  F:"keep central balance behind the score.",
  G:()=>`stay wide as the backup if ${name("C")} is covered late.`
 }
};

const hoJobs={
 0:{
  A:"track the pull and get under it first.",
  B:()=>`peel wide as ${name("A")}'s first outlet.`,
  C:"start spreading to the right-handler spot.",
  D:"stay wide as the first cutter. Wait for shape.",
  E:"take the left-middle cutter lane and keep width.",
  F:"take the right-middle cutter lane and keep width.",
  G:"hold the far-right cutter space."
 },
 1:{
  A:"move to the landing spot and settle the disc.",
  B:()=>`arrive wide so ${name("A")} has an easy first pass.`,
  C:"finish getting wide as the right handler.",
  D:"stay patient across the cutter line.",
  E:"keep your lane wide and leave the middle open.",
  F:"hold your lane and watch the handlers settle.",
  G:"stay far side and do not pinch in."
 },
 2:{
  A:"you have the disc. Get it under control before throwing.",
  B:()=>`show hands as the easy outlet for ${name("A")}.`,
  C:"stay wide as the second handler option.",
  D:"wait as the first cutter. The shape comes first.",
  E:"hold width and keep space behind D.",
  F:"hold width and keep space behind E.",
  G:"stay far side so the deep lane stays open."
 },
 3:{
  A:()=>`after you move it to ${name("B")}, fill left as the reset.`,
  B:"catch the outlet and face the field.",
  C:()=>`be ready as the next swing handler for ${name("B")}.`,
  D:"wait for the disc to reach the side before cutting.",
  E:"hold wide and do not start with D.",
  F:"keep your lane open for the later swing.",
  G:"stay far side and keep the deep lane long."
 },
 4:{
  A:"stay left and easy as the reset handler.",
  B:"hold middle-handler balance and read the cutters.",
  C:"stay wide right so the disc can keep swinging.",
  D:"hold the left cutter lane until the swing changes angle.",
  E:"stay central in the cutter line and keep space.",
  F:"hold the right-middle cutter lane and stay patient.",
  G:"hold the far-side lane and stay deep enough to threaten."
 },
 5:{
  A:"stay wide left after the first swing so the return lane stays open.",
  B:"center the disc and keep it moving to the right side.",
  C:"catch wide right and get ready to read D.",
  D:"wait until C has the new angle. Then start the setup.",
  E:"hold width so D has a clear under lane.",
  F:"stay home. Your cut comes after the next swing.",
  G:"stay far side and keep the defense stretched."
 },
 6:{
  A:"stay left as the easy reset if the under is covered.",
  B:"hold middle support behind the new thrower.",
  C:()=>`watch ${name("D")}'s fake and keep the lane closed until the plant.`,
  D:"sell deep first and make the defender turn.",
  E:"stay out of D's lane and keep width.",
  F:"hold your lane and watch the under open.",
  G:"stay far side and keep deep help honest."
 },
 7:{
  A:"stay behind the disc as the safety valve.",
  B:"keep middle spacing and be ready if the throw resets.",
  C:()=>`see if ${name("D")} wins the under cleanly.`,
  D:"cut under hard into the new lane.",
  E:"wait behind D and leave the deep space empty.",
  F:"stay wide and do not follow D inside.",
  G:"hold far-side depth and keep backside help busy."
 },
 8:{
  A:"stay left and available if the window closes.",
  B:"keep the middle reset short and easy.",
  C:()=>`throw only if ${name("D")} is clearly open.`,
  D:"show hands and keep moving through the under.",
  E:"stay deep-side patient so the next cut can go.",
  F:"hold width for the later swing.",
  G:"stay far side and do not drift toward the throw."
 },
 9:{
  A:"slide up behind the play as the next reset.",
  B:"stay central behind the play.",
  C:"release early if the under lane is clean.",
  D:"catch moving and turn upfield fast.",
  E:"wait until D secures the catch.",
  F:"stay wide and keep next-side space open.",
  G:"hold far-side depth for later continuation."
 },
 10:{
  A:"stay left under the disc as backup.",
  B:"hold middle reset shape behind D.",
  C:"stay wide right as the easy swing back.",
  D:"catch, turn, and look up before forcing deep.",
  E:"go only after D is balanced and looking.",
  F:"keep width and leave the deep lane for E.",
  G:"stay far side and read the next cut."
 },
 11:{
  A:"stay left under D so the deep look is optional.",
  B:"keep middle help available.",
  C:"stay wide for the swing if deep is covered.",
  D:()=>`check ${name("E")} deep and keep your feet calm.`,
  E:"attack deep behind the under catch.",
  F:"hold your lane so E has the whole deep side.",
  G:"stay far side and do not cut under the deep look."
 },
 12:{
  A:"stay under the disc in case the deep look is closed.",
  B:"be the easy middle reset if needed.",
  C:"stay ready for the swing if deep is shut.",
  D:()=>`throw deep only if ${name("E")} is clearly ahead.`,
  E:"keep running through the deep lane.",
  F:"wait. Your cut starts only after the next swing.",
  G:"hold far-side depth and keep the help defender honest."
 },
 13:{
  A:"stay left as the reset while E clears.",
  B:"hold middle balance behind D.",
  C:"be ready for the swing back to your side.",
  D:"keep the disc and let the deep lane clear first.",
  E:"clear hard through and out of the deep lane.",
  F:"stay patient until the swing changes the angle.",
  G:"hold far side and keep the new lane long."
 },
 14:{
  A:"stay left and be ready if the swing needs one more pass.",
  B:"stay central as the easy link behind the swing.",
  C:"catch the swing and look at the new under lane.",
  D:"swing early to change the angle.",
  E:"finish the clear and stay out of F's lane.",
  F:"read the new angle as the next under cutter.",
  G:"hold far-side depth for the continuation."
 },
 15:{
  A:"stay left reset and do not call off F.",
  B:"hold the middle so C has a safe outlet.",
  C:"settle the swing and wait for F to start.",
  D:"clear to the back and stay out of the new lane.",
  E:"stay high and cleared so the under is open.",
  F:"wait for C to catch, then read the under lane.",
  G:"hold far-side depth and get ready for the next deep cut."
 },
 16:{
  A:"stay left under the disc as bailout.",
  B:"keep middle support behind C.",
  C:()=>`read ${name("F")} and throw only if the under stays clean.`,
  D:"stay back and do not drag traffic into the lane.",
  E:"keep clearing space on the far side.",
  F:"cut under hard from the new angle.",
  G:"wait deep. Your cut comes after F's catch."
 },
 17:{
  A:"slide up behind the play as the next reset.",
  B:"stay short and easy behind the throw.",
  C:"take the clean under and then clear support.",
  D:"stay back and keep the middle open.",
  E:"hold clear space so G has room next.",
  F:"catch moving and turn to the far side.",
  G:"start reading the deep lane off F's catch."
 },
 18:{
  A:"stay left as the reset if F cannot hit deep.",
  B:"hold middle helper shape.",
  C:"stay wide behind play as the safe swing back.",
  D:"stay back and do not crowd G's lane.",
  E:"stay clear so the far-side deep lane is empty.",
  F:()=>`check ${name("G")} deep before forcing anything else.`,
  G:"attack deep from the far side after F turns."
 },
 19:{
  A:"stay underneath as the reset option.",
  B:"be an easy middle outlet if deep is covered.",
  C:"hold width and do not cross into the throw.",
  D:"stay back and keep the lane clean.",
  E:"stay clear and make help defenders choose.",
  F:"look deep first, then keep the disc safe.",
  G:"keep running if you win it. Clear if you do not."
 },
 20:{
  A:"show early under F as the safe reset.",
  B:"hold middle balance while G clears.",
  C:"stay wide so the reset can swing again.",
  D:"reset your spacing for the next loop.",
  E:"stay clear and leave room for the reset.",
  F:()=>`if ${name("G")} is covered, use the reset and keep possession.`,
  G:"clear hard out of the deep lane if it is covered."
 },
 21:{
  A:"arrive under and catch the reset in balance.",
  B:()=>`get wide early as ${name("A")}'s next swing.`,
  C:"stay right so the next swing stays easy.",
  D:"reset left-cutter spacing for the next loop.",
  E:"hold cleared depth on the far side.",
  F:"take the safe reset instead of forcing deep.",
  G:"finish your clear and stay out of the next lane."
 },
 22:{
  A:()=>`swing early to ${name("B")} and reopen the field.`,
  B:"receive the swing and face the next cutter lane.",
  C:"hold wide right as the next swing option.",
  D:"wait for the new angle before starting again.",
  E:"keep width in the far-left cutter space.",
  F:"settle into the right-middle lane again.",
  G:"hold far-side depth for the next cycle."
 },
 23:{
  A:"stay left as the reset while the next attack starts.",
  B:"read the field and let the first cutter set up.",
  C:"stay wide right so the handlers keep their shape.",
  D:"start the next fake from the left cutter lane.",
  E:"hold central spacing and leave D the first lane.",
  F:"hold right-middle space and stay ready for later.",
  G:"keep the far-side deep lane available."
 }
};

function playerBody(s){
 const ps=players(), p=ps.find(x=>x.id===player);
 if(!p)return "";
 if(sequence==="ho"){
  const j=hoJob(step,player);
  return j?roleNote(p,j):roleNote(p,"hold width and watch the disc for the next lane.");
 }
 if(sequence==="cup"){
  const j=cupJob(step,player);
  return j?roleNote(p,j):roleNote(p,"hold your space and watch the play develop.");
 }
 if(sequence==="pull"){
  if(step<4){
   const early=pullEarlyBody(step,p);
   if(early)return early;
  }
  if(player==="A"){
   const k=pullKiraBody(step,s,p);
   if(k)return k;
  }
  if(player==="F"&&step>=8){
   const f=pullFBody(step,p);
   if(f)return f;
  }
  const active=pullActiveJob(step,player);
  if(active)return roleNote(p,active);
  const hold=pullHoldJob(step,player);
  if(hold)return roleNote(p,hold);
  if(player===s.disc)return roleNote(p,"read the first clean option. If nothing is there, use the reset.");
  if(player===s.reset)return roleNote(p,"stay available as the reset. Keep enough spacing for an easy pass.");
  if(player===s.next)return roleNote(p,"wait for the cue. Go only when the lane is clean.");
  return roleNote(p,"hold your spot and keep the lane clear.");
 }
 const direct={
  A:`${p.name}, you are reading the pull. Get to the landing spot early and get the disc settled.`,
  B:`${p.name}, you are the reset or outlet. Get wide enough that ${name("A")} has an easy first pass.`,
  C:`${p.name}, you are near the front of the stack. Get organized, then be ready to make the first real cut.`,
  D:`${p.name}, hold your space until ${name("C")}'s cut starts.`,
  E:`${p.name}, you are in the middle of the stack. Hold your lane and wait.`,
  F:`${p.name}, hold the back-left space. Do not drift into the first cutting lane.`,
  G:`${p.name}, hold the back-right space. Stay patient and keep the lane clear.`
 };
 return direct[player]+"\n\n"+(baseJobs[player]?.[Math.min(step,3)]||"Stay organized and keep the active lane clear.");
}
