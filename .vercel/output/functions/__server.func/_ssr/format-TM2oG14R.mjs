//#region node_modules/.nitro/vite/services/ssr/assets/format-TM2oG14R.js
var PKT = "Asia/Karachi";
function formatDate(value) {
	if (!value) return "—";
	const d = typeof value === "string" ? new Date(value) : value;
	if (Number.isNaN(d.getTime())) {
		if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
			const [y, m, day] = value.split("-").map(Number);
			return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString("en-GB", {
				day: "numeric",
				month: "short",
				year: "numeric",
				timeZone: "UTC"
			});
		}
		return String(value);
	}
	return d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		timeZone: PKT
	});
}
function formatDateTime(value) {
	if (!value) return "—";
	const d = typeof value === "string" ? new Date(value) : value;
	if (Number.isNaN(d.getTime())) return String(value);
	return d.toLocaleString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		timeZone: PKT
	});
}
function letterAndGpa(pct) {
	if (pct >= 85) return {
		letter: "A+",
		gpa: 4
	};
	if (pct >= 80) return {
		letter: "A",
		gpa: 3.7
	};
	if (pct >= 75) return {
		letter: "B+",
		gpa: 3.3
	};
	if (pct >= 70) return {
		letter: "B",
		gpa: 3
	};
	if (pct >= 65) return {
		letter: "C+",
		gpa: 2.7
	};
	if (pct >= 60) return {
		letter: "C",
		gpa: 2.3
	};
	if (pct >= 55) return {
		letter: "D+",
		gpa: 2
	};
	if (pct >= 50) return {
		letter: "D",
		gpa: 1
	};
	return {
		letter: "F",
		gpa: 0
	};
}
function num(v) {
	if (typeof v === "number") return v;
	if (typeof v === "string") return Number(v);
	return 0;
}
var WEEKDAYS = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
function youtubeId(url) {
	try {
		const u = new URL(url);
		if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
		return u.searchParams.get("v");
	} catch {
		return null;
	}
}
function platformLabel(p) {
	if (p === "meet") return "Google Meet";
	if (p === "zoom") return "Zoom";
	if (p === "teams") return "Microsoft Teams";
	return p;
}
function materialLabel(t) {
	return {
		pdf: "PDF",
		docx: "Word",
		ppt: "PowerPoint",
		pptx: "PowerPoint",
		video: "Video",
		image: "Image",
		zip: "Archive",
		link: "Link",
		youtube: "YouTube"
	}[t] ?? t.toUpperCase();
}
function roleLabel(role) {
	return {
		super_admin: "Super Admin",
		academic_admin: "Academic Admin",
		class_incharge: "Class Incharge",
		teacher: "Teacher",
		student: "Student"
	}[role] ?? role;
}
//#endregion
export { materialLabel as a, roleLabel as c, letterAndGpa as i, youtubeId as l, formatDate as n, num as o, formatDateTime as r, platformLabel as s, WEEKDAYS as t };
