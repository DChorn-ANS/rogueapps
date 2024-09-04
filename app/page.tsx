"use client";

import { useState, useEffect } from 'react';
import { RogueApp } from '../lib/types';
import styles from '../styles/Home.module.css';
import Callout from './components/Callout';
import { fetchRogueApps } from '../lib/fetchRogueApps';

export default function Home() {
  const [rogueApps, setRogueApps] = useState<RogueApp[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  useEffect(() => {
    async function loadRogueApps() {
      const data = await fetchRogueApps();
      setRogueApps(data);
    }
    loadRogueApps();
  }, []);

  const filteredApps = rogueApps.filter(app =>
    app.appDisplayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(app.contributors) ? app.contributors.join(', ').toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
    (Array.isArray(app.mitreTTP) ? app.mitreTTP.join(', ').toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
    (Array.isArray(app.tags) ? app.tags.join(' ').toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
    app.permissions?.some(permission =>
      permission.resource?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.permission?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.type?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleExpandCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>RogueApps</h1>
        <h3 className={styles.poweredBy}>
          When Good Apps Go Rogue | Powered by <a href="https://www.huntress.com" target="_blank" rel="noopener noreferrer">Huntress</a>
        </h3>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.search}
        />
        <Callout />
        <div className={`${styles.grid} ${expandedCard !== null ? styles.hidden : ''}`}>
          {filteredApps.map((app, index) => (
            <div
              key={index}
              className={`${styles.card} ${expandedCard === index ? styles.expanded : ''}`}
              onClick={() => toggleExpandCard(index)}
            >
              <h3>{app.appDisplayName}</h3>
              <p>{app.description}</p>
              {expandedCard === index && (
                <div className={styles.cardDetails}>
                  <p><strong>App ID: </strong> {app.appId}</p>
                  <p><strong>Owner Organization ID: </strong> {app.appOwnerOrganizationId}</p>
                  <p><strong>Publisher: </strong> {app.appPublisherName}</p>
                  <p>
                    <strong>Contributors: </strong>
                    {Array.isArray(app.contributors) && app.contributors.length > 0
                      ? app.contributors.length === 1
                        ? app.contributors[0]
                        : app.contributors.join(', ')
                      : 'N/A'}
                  </p>
                  <p><strong>MITRE TTP: </strong> {Array.isArray(app.mitreTTP) ? app.mitreTTP.join(', ') : 'N/A'}</p>
                  <p><strong>Tags: </strong> {Array.isArray(app.tags) ? app.tags.join(', ') : 'N/A'}</p>
                  <h4>Permissions: </h4>
                  <ul className={styles.tealList}>
                    {app.permissions.map((permission, permIndex) => (
                      <li key={permIndex}>
                        <code>{permission.resource}:</code> <code>{permission.permission}</code> (<code>{permission.type}</code>)
                      </li>
                    ))}
                  </ul>
                  <h4>References: </h4>
                  <ul className={styles.tealList}>
                    {app.references.map((ref, refIndex) => (
                      <li key={refIndex}>
                        <a href={ref} target="_blank" rel="noopener noreferrer">
                          {ref}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {expandedCard !== null && (
          <div
            className={`${styles.expandedCard} ${styles.card}`}
            onClick={() => toggleExpandCard(expandedCard)}
          >
            <h3>{filteredApps[expandedCard].appDisplayName}</h3>
            <p>{filteredApps[expandedCard].description}</p>
            <div className={styles.cardDetails}>
              <p><strong>App ID: </strong> {filteredApps[expandedCard].appId}</p>
              <p><strong>Owner Organization ID: </strong> {filteredApps[expandedCard].appOwnerOrganizationId}</p>
              <p><strong>Publisher: </strong> {filteredApps[expandedCard].appPublisherName}</p>
              <p>
                <strong>Contributors: </strong>
                {Array.isArray(filteredApps[expandedCard].contributors) && filteredApps[expandedCard].contributors.length > 0
                  ? filteredApps[expandedCard].contributors.length === 1
                    ? filteredApps[expandedCard].contributors[0]
                    : filteredApps[expandedCard].contributors.join(', ')
                  : 'N/A'}
              </p>
              <p><strong>MITRE TTP:</strong> {Array.isArray(filteredApps[expandedCard].mitreTTP) ? filteredApps[expandedCard].mitreTTP.join(', ') : 'N/A'}</p>
              <p><strong>Tags:</strong> {Array.isArray(filteredApps[expandedCard].tags) ? filteredApps[expandedCard].tags.join(', ') : 'N/A'}</p>
              <h4>Permissions:</h4>
              <ul className={styles.tealList}>
                {filteredApps[expandedCard].permissions.map((permission, permIndex) => (
                  <li key={permIndex}>
                    <code>{permission.resource}:</code> <code>{permission.permission}</code> (<code>{permission.type}</code>)
                  </li>
                ))}
              </ul>
              <h4>References:</h4>
              <ul className={styles.tealList}>
                {filteredApps[expandedCard].references.map((ref, refIndex) => (
                  <li key={refIndex}>
                    <a href={ref} target="_blank" rel="noopener noreferrer">
                      {ref}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
