"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Dropzone.module.scss";

type Props = {
	files: File[];
	onFilesChange: (files: File[]) => void;
};

function fmtSize(b: number): string {
	if (b < 1024) return `${b} B`;
	if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
	return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

function PdfIcon() {
	return (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
		</svg>
	);
}

export default function Dropzone({ files, onFilesChange }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [dragging, setDragging] = useState(false);
	const objectUrls = useRef<Map<File, string>>(new Map());

	function getUrl(file: File): string {
		if (!objectUrls.current.has(file)) {
			objectUrls.current.set(file, URL.createObjectURL(file));
		}
		return objectUrls.current.get(file)!;
	}

	useEffect(() => {
		return () => {
			objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
		};
	}, []);

	function addFiles(incoming: FileList | null) {
		if (!incoming) return;
		const next = [...files, ...Array.from(incoming)];
		onFilesChange(next);
	}

	function removeFile(index: number) {
		const removed = files[index];
		const url = objectUrls.current.get(removed);
		if (url) {
			URL.revokeObjectURL(url);
			objectUrls.current.delete(removed);
		}
		onFilesChange(files.filter((_, i) => i !== index));
	}

	return (
		<div className={styles.wrap}>
			<label
				className={`${styles.drop} ${dragging ? styles.dragover : ""}`}
				onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
				onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
				onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
				onDrop={(e) => {
					e.preventDefault();
					setDragging(false);
					addFiles(e.dataTransfer?.files ?? null);
				}}
			>
				<input
					ref={inputRef}
					type="file"
					accept="image/*,.pdf"
					multiple
					className={styles.fileInput}
					onChange={(e) => addFiles(e.target.files)}
				/>

				<span className={styles.dropIcon}>
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="17 8 12 3 7 8" />
						<line x1="12" y1="3" x2="12" y2="15" />
					</svg>
				</span>

				<span className={styles.dropTitle}>
					Arrastrá tu receta o <u>elegí un archivo</u>
				</span>
				<span className={styles.dropMeta}>Foto clara o PDF · máx. 10 MB por archivo</span>

				<span className={styles.formats}>
					{["JPG", "PNG", "HEIC", "PDF"].map((f) => (
						<span key={f} className={styles.format}>{f}</span>
					))}
				</span>
			</label>

			{files.length > 0 && (
				<ul className={styles.fileList}>
					{files.map((file, i) => {
						const isImage = file.type.startsWith("image/");
						return (
							<li key={`${file.name}-${i}`} className={styles.fileItem}>
								<span className={styles.thumb}>
									{isImage
										? <img src={getUrl(file)} alt="" />
										: <PdfIcon />
									}
								</span>
								<span className={styles.fileBody}>
									<span className={styles.fileName}>{file.name}</span>
									<span className={styles.fileMeta}>{fmtSize(file.size)} · {file.type || "archivo"}</span>
								</span>
								<button
									type="button"
									className={styles.removeBtn}
									onClick={() => removeFile(i)}
									aria-label={`Quitar ${file.name}`}
								>
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
										<line x1="18" y1="6" x2="6" y2="18" />
										<line x1="6" y1="6" x2="18" y2="18" />
									</svg>
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
