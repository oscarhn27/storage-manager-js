import { CookieSettings, IStorage } from "../types";
import { fnDate } from "../utils";

export default class Cookie<T> implements IStorage {
	private static cookiesArray = () => document.cookie.split(";");

	public static has(key: string) {
		return Cookie.cookiesArray().some((item) => item.trim().startsWith(`${key}=`));
	}

	public static json<E>(): E | {} {
		const cookie = document.cookie;
		if (cookie === "") {
			return {};
		}
		return Cookie.cookiesArray()
			.map((v) => v.split("="))
			.reduce((acc: any, v: any) => {
				acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
				return acc;
			}, {});
	}

	public static deleteAll() {
		Cookie.cookiesArray().forEach((cookie) => {
			document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
		});
	}

	public static get<E>(key: string) {
		const value = Cookie.json<E>()[key];
		try {
			return JSON.parse(value);
		} catch (error) {
			return value;
		}
	}

	public static delete(key: string) {
		document.cookie = `${encodeURIComponent(key)}=;expires=${new Date().toUTCString()}`;
	}

	public static set(key: string, object: any, { expires = "1969-12-31T23:59:59.000Z", path = "/", useSecure = true }: CookieSettings) {
		const secure = window.location.protocol === "https" ? ";secure" : useSecure ? ";secure" : ";";
		const exp = fnDate(expires);
		const value = encodeURIComponent(JSON.stringify(object));
		document.cookie = `${encodeURIComponent(key)}=${value};path=${path};expires=${exp};samesite=strict${secure}`;
	}

	public has(key: string) {
		return Cookie.has(key);
	}

	public json(): T | {} {
		return Cookie.json<T>();
	}

	public deleteAll(): IStorage {
		Cookie.deleteAll();
		return this;
	}

	public get(key: string) {
		Cookie.get(key);
		return this;
	}
	public delete(key: string): IStorage {
		Cookie.delete(key);
		return this;
	}

	public set(key: string, object: any, { expires = "1969-12-31T23:59:59.000Z", path = "/", useSecure = true }: CookieSettings): IStorage {
		Cookie.set(key, object, { expires, path, useSecure });
		return this;
	}
}