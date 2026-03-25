import { db, doc, collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, setDoc } from './supabase';
import { OfficialProtocol, OfficialPattern } from '../types';

// =====================================
// PROTOCOLOS OFICIAIS
// =====================================

export async function fetchOfficialProtocols(workspaceId: string): Promise<OfficialProtocol[]> {
    if (!workspaceId) return [];
    try {
        const q = query(collection(db, 'official_protocols'), where('workspace_id', '==', workspaceId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                workspaceId: data.workspace_id,
                shortDescription: data.short_description,
                fullDescription: data.full_description,
                responsibleArea: data.responsible_area,
                impactedModules: data.impacted_modules || [],
                lastReviewDate: data.last_review_date ? new Date(data.last_review_date) : new Date(),
                isActive: data.is_active,
                createdAt: data.created_at ? new Date(data.created_at) : new Date(),
                updatedAt: data.updated_at ? new Date(data.updated_at) : new Date()
            } as OfficialProtocol;
        });
    } catch (e) {
        console.error('Error fetching official protocols:', e);
        return [];
    }
}

export async function createOfficialProtocol(protocol: Omit<OfficialProtocol, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<string | null> {
    try {
        const payload = {
            workspace_id: protocol.workspaceId,
            code: protocol.code,
            name: protocol.name,
            family: protocol.family,
            category: protocol.category,
            short_description: protocol.shortDescription,
            full_description: protocol.fullDescription,
            objective: protocol.objective,
            criticality: protocol.criticality,
            mandatory: protocol.mandatory,
            priority: protocol.priority,
            status: protocol.status,
            responsible_area: protocol.responsibleArea,
            impacted_modules: protocol.impactedModules,
            version: 1,
            last_review_date: protocol.lastReviewDate,
            is_active: protocol.isActive,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await addDoc(collection(db, 'official_protocols'), payload);
        return docRef.id;
    } catch (e) {
        console.error('Error creating protocol:', e);
        return null;
    }
}

export async function updateOfficialProtocol(id: string, updates: Partial<OfficialProtocol>): Promise<boolean> {
    try {
        const payload: any = { updated_at: new Date() };
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.criticality !== undefined) payload.criticality = updates.criticality;
        if (updates.priority !== undefined) payload.priority = updates.priority;
        if (updates.lastReviewDate !== undefined) payload.last_review_date = updates.lastReviewDate;
        
        await updateDoc(doc(db, 'official_protocols', id), payload);
        return true;
    } catch (e) {
        console.error('Error updating protocol:', e);
        return false;
    }
}

export async function deleteOfficialProtocol(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, 'official_protocols', id));
        return true;
    } catch (e) {
        console.error('Error deleting protocol:', e);
        return false;
    }
}

// =====================================
// PADRÕES OFICIAIS
// =====================================

export async function fetchOfficialPatterns(workspaceId: string): Promise<OfficialPattern[]> {
    if (!workspaceId) return [];
    try {
        const q = query(collection(db, 'official_patterns'), where('workspace_id', '==', workspaceId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                workspaceId: data.workspace_id,
                patternType: data.pattern_type,
                valueOrDefinition: data.value_or_definition,
                responsibleArea: data.responsible_area,
                lastReviewDate: data.last_review_date ? new Date(data.last_review_date) : new Date(),
                isActive: data.is_active,
                createdAt: data.created_at ? new Date(data.created_at) : new Date(),
                updatedAt: data.updated_at ? new Date(data.updated_at) : new Date()
            } as OfficialPattern;
        });
    } catch (e) {
        console.error('Error fetching official patterns:', e);
        return [];
    }
}

export async function createOfficialPattern(pattern: Omit<OfficialPattern, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<string | null> {
    try {
        const payload = {
            workspace_id: pattern.workspaceId,
            pattern_type: pattern.patternType,
            name: pattern.name,
            category: pattern.category,
            description: pattern.description,
            value_or_definition: pattern.valueOrDefinition,
            status: pattern.status,
            responsible_area: pattern.responsibleArea,
            version: 1,
            last_review_date: pattern.lastReviewDate,
            is_active: pattern.isActive,
            created_at: new Date(),
            updated_at: new Date()
        };
        const docRef = await addDoc(collection(db, 'official_patterns'), payload);
        return docRef.id;
    } catch (e) {
        console.error('Error creating pattern:', e);
        return null;
    }
}

export async function updateOfficialPattern(id: string, updates: Partial<OfficialPattern>): Promise<boolean> {
    try {
        const payload: any = { updated_at: new Date() };
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.valueOrDefinition !== undefined) payload.value_or_definition = updates.valueOrDefinition;
        if (updates.lastReviewDate !== undefined) payload.last_review_date = updates.lastReviewDate;

        await updateDoc(doc(db, 'official_patterns', id), payload);
        return true;
    } catch (e) {
        console.error('Error updating pattern:', e);
        return false;
    }
}

export async function deleteOfficialPattern(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, 'official_patterns', id));
        return true;
    } catch (e) {
        console.error('Error deleting pattern:', e);
        return false;
    }
}
