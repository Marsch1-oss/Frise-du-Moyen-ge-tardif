const data = [
  { type: "regne", title: "Louis XIV", start: 1643, end: 1715 },
  { type: "regne", title: "Napoléon", start: 1804, end: 1815 },
  { type: "event", title: "Révolution", date: 1789 }
];

const container = document.getElementById("timeline-container");
const rulersDiv = document.getElementById("rulers");
const eventsDiv = document.getElementById("events");

let zoom = 1;
let offsetX = 0;

const minDate = 1600;
const pixelsPerYear = 2;

function scale(date) {
  return ((date - minDate) * pixelsPerYear * zoom) + offsetX;
}

function layoutRegnes(regnes) {
  regnes.sort((a,b)=>a.start-b.start);
  const rows = [];

  regnes.forEach(r=>{
    let placed=false;
    for(let row of rows){
      let last=row[row.length-1];
      if(r.start>last.end){
        row.push(r);
        r.row=rows.indexOf(row);
        placed=true;
        break;
      }
    }
    if(!placed){
      rows.push([r]);
      r.row=rows.length-1;
    }
  });
  return rows;
}

function render(){
  rulersDiv.innerHTML="";
  eventsDiv.innerHTML="";

  const regnes = data.filter(d=>d.type==="regne");
  const events = data.filter(d=>d.type==="event");

  const rows = layoutRegnes(regnes);
  rulersDiv.style.height = (rows.length * 20) + "px";

  regnes.forEach(r=>{
    const div=document.createElement("div");
    div.className="ruler-chip";
    div.textContent=r.title;

    div.style.left=scale(r.start)+"px";
    div.style.width=(scale(r.end)-scale(r.start))+"px";
    div.style.top=(r.row*20)+"px";

    rulersDiv.appendChild(div);
  });

  events.forEach(e=>{
    const div=document.createElement("div");
    div.className="event";
    div.textContent=e.title;
    div.style.left=scale(e.date)+"px";
    eventsDiv.appendChild(div);
  });
}

container.addEventListener("wheel",(e)=>{
  e.preventDefault();
  const factor=1.1;
  const mouseX=e.offsetX;
  const oldZoom=zoom;

  zoom *= e.deltaY<0 ? factor : 1/factor;
  offsetX = mouseX - ((mouseX - offsetX) * (zoom / oldZoom));

  render();
});

let isDragging=false;
let startX=0;

container.addEventListener("mousedown",(e)=>{
  isDragging=true;
  startX=e.clientX;
});

window.addEventListener("mousemove",(e)=>{
  if(!isDragging) return;
  let dx=e.clientX-startX;
  startX=e.clientX;
  offsetX+=dx;
  render();
});

window.addEventListener("mouseup",()=> isDragging=false);

render();
